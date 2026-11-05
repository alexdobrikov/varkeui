import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { CloseIcon, ImageIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { Spinner } from '../Button/Spinner';
import { Button } from '../Button';
import { Input, InputButton } from '../Input';
import { ImageInputError, imageTimeout, prepareImage, type WebPOptions } from './prepareImage';

export interface ImageInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onError'
> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  value?: string | null;
  placeholder?: ReactNode;
  /** Upload the selected file; a returned promise keeps the input busy until settled. */
  onFileSelect: (file: File) => void | Promise<void>;
  onRemove?: () => void;
  accept?: string;
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  uploadLabel?: string;
  replaceLabel?: string;
  removeLabel?: string;
  /** Maximum original and processed file size in bytes. Checked before decoding/uploading. */
  maxSize?: number;
  /** Convert locally to a still WebP preview, optionally resizing. Off by default. */
  webp?: boolean | WebPOptions;
  /** Support Ctrl/Cmd+V and a clipboard button. Requires a secure context for clipboard.read. */
  allowPaste?: boolean;
  pasteLabel?: string;
  /** Optional URL source. URLs are validated, not fetched or converted by this component. */
  onUrlSelect?: (url: string) => void | Promise<void>;
  urlLabel?: string;
  urlPlaceholder?: string;
  applyUrlLabel?: string;
  onError?: (error: Error) => void;
  messages?: Partial<Record<'size' | 'type' | 'processing' | 'clipboard' | 'url', string>>;
}

export const ImageInput = forwardRef<HTMLDivElement, ImageInputProps>(function ImageInput(
  {
    label,
    hint,
    error,
    value,
    placeholder = 'JPG, PNG or WebP',
    onFileSelect,
    onRemove,
    accept = 'image/*',
    loading = false,
    disabled = false,
    block = false,
    uploadLabel = 'Upload',
    replaceLabel = 'Replace',
    removeLabel = 'Remove',
    maxSize,
    webp = false,
    allowPaste = false,
    pasteLabel = 'Paste image',
    onUrlSelect,
    urlLabel = 'Use link',
    urlPlaceholder = 'https://example.com/image.webp',
    applyUrlLabel = 'Apply',
    onError,
    messages,
    className,
    onPaste,
    ...rest
  },
  ref,
) {
  const inputId = useId();
  const labelId = useId();
  const hintId = useId();
  const file = useRef<HTMLInputElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [url, setUrl] = useState('');
  const busy = loading || disabled || processing;
  const message = error ?? localError ?? hint;
  const invalid = error != null || localError != null;

  const report = (reason: unknown) => {
    const problem = reason instanceof Error ? reason : new Error('Unable to load image');
    const code = problem instanceof ImageInputError ? problem.code : undefined;
    const defaults = {
      size: maxSize
        ? `Image must be at most ${Math.round(maxSize / 1024 / 1024)} MB`
        : 'Image is too large',
      type: 'Select a supported image',
      processing: 'Unable to process this image',
      clipboard: 'No image available. Focus this field and paste with Ctrl/Cmd+V.',
      url: 'Enter an http:// or https:// image URL',
    };
    const text = code ? (messages?.[code] ?? defaults[code]) : problem.message;
    setLocalError(text);
    onError?.(new Error(text));
  };

  const run = async (work: () => Promise<void>) => {
    if (busy || inFlight.current) return;
    inFlight.current = true;
    setProcessing(true);
    setLocalError(null);
    try {
      await work();
    } catch (reason) {
      report(reason);
    } finally {
      inFlight.current = false;
      setProcessing(false);
    }
  };

  const selectFile = (selected: File) =>
    run(async () => {
      const prepared = await prepareImage(selected, { maxSize, accept, webp });
      await onFileSelect(prepared);
    });
  const pick = () => {
    if (!busy) file.current?.click();
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (selected) void selectFile(selected);
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const selected = event.dataTransfer.files?.[0];
    if (selected) void selectFile(selected);
  };
  const paste = () =>
    run(async () => {
      if (!navigator.clipboard?.read)
        throw new ImageInputError('clipboard', 'Clipboard unavailable');
      let items: ClipboardItems;
      try {
        items = await imageTimeout(navigator.clipboard.read());
      } catch {
        throw new ImageInputError('clipboard', 'Clipboard permission denied');
      }
      for (const item of items) {
        const type = item.types.find((mime) => mime.startsWith('image/'));
        if (!type) continue;
        const blob = await imageTimeout(item.getType(type));
        const selected = new File([blob], `clipboard.${type.split('/')[1] || 'png'}`, { type });
        await onFileSelect(await prepareImage(selected, { maxSize, accept, webp }));
        return;
      }
      throw new ImageInputError('clipboard', 'No clipboard image');
    });
  const applyUrl = () =>
    run(async () => {
      let parsed: URL;
      try {
        parsed = new URL(url.trim());
      } catch {
        throw new ImageInputError('url', 'Invalid URL');
      }
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password)
        throw new ImageInputError('url', 'Invalid URL');
      await onUrlSelect?.(parsed.href);
      setShowUrl(false);
      setUrl('');
    });

  return (
    <div
      ref={ref}
      {...rest}
      onPaste={(event) => {
        onPaste?.(event);
        if (event.defaultPrevented || !allowPaste || busy) return;
        const selected = Array.from(event.clipboardData.items)
          .find((item) => item.kind === 'file' && item.type.startsWith('image/'))
          ?.getAsFile();
        if (selected) {
          event.preventDefault();
          void selectFile(selected);
        }
      }}
      className={cx(
        'vui-image-input',
        block && 'vui-image-input--block',
        invalid && 'vui-image-input--invalid',
        disabled && 'vui-image-input--disabled',
        dragging && 'vui-image-input--dragging',
        className,
      )}
    >
      {label != null && (
        <label id={labelId} className="vui-image-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div
        ref={field}
        className="vui-image-input__field"
        tabIndex={busy ? -1 : 0}
        role="group"
        aria-label={typeof label === 'string' ? `${label}: image source` : 'Image source'}
        aria-describedby={message != null ? hintId : undefined}
        onClick={pick}
        onKeyDown={(event) => {
          if (
            event.target === event.currentTarget &&
            (event.key === 'Enter' || event.key === ' ')
          ) {
            event.preventDefault();
            pick();
          }
        }}
        onDragLeave={() => setDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDrop={handleDrop}
      >
        <span className="vui-image-input__preview">
          {value ? <img alt="" src={value} /> : <ImageIcon />}
        </span>
        <span className="vui-image-input__text">{value ? null : placeholder}</span>
        <span className="vui-image-input__actions" onClick={(event) => event.stopPropagation()}>
          {value && onRemove && !busy && (
            <InputButton
              aria-label={removeLabel}
              disabled={disabled}
              onClick={() => {
                setLocalError(null);
                onRemove();
              }}
              type="button"
              variant="ghost"
            >
              <CloseIcon />
            </InputButton>
          )}
          <InputButton disabled={busy} onClick={pick} type="button">
            {loading || processing ? (
              <Spinner className="vui-image-input__spinner" />
            ) : value ? (
              replaceLabel
            ) : (
              uploadLabel
            )}
          </InputButton>
        </span>
        <input
          ref={file}
          id={inputId}
          accept={accept}
          aria-describedby={message != null ? hintId : undefined}
          className="vui-image-input__file"
          disabled={busy}
          onChange={handleChange}
          tabIndex={-1}
          type="file"
        />
      </div>
      {(allowPaste || onUrlSelect) && (
        <div className="vui-image-input__sources">
          {allowPaste && (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              disabled={busy}
              onClick={() => {
                field.current?.focus();
                void paste();
              }}
            >
              {pasteLabel}
            </Button>
          )}
          {onUrlSelect && (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              disabled={busy}
              aria-expanded={showUrl}
              onClick={() => {
                setShowUrl((current) => !current);
                setLocalError(null);
              }}
            >
              {urlLabel}
            </Button>
          )}
        </div>
      )}
      {showUrl && onUrlSelect && (
        <div className="vui-image-input__url">
          <Input
            block
            type="url"
            value={url}
            disabled={busy}
            placeholder={urlPlaceholder}
            aria-label={urlLabel}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void applyUrl();
              }
            }}
          />
          <Button
            size="sm"
            type="button"
            disabled={busy || !url.trim()}
            onClick={() => void applyUrl()}
          >
            {applyUrlLabel}
          </Button>
        </div>
      )}
      {message != null && (
        <div className="vui-image-input__hint" id={hintId} role={invalid ? 'alert' : undefined}>
          {message}
        </div>
      )}
    </div>
  );
});
