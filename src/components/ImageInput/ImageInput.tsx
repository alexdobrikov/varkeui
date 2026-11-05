import {
  forwardRef,
  useId,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { CloseIcon, ImageIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { Button, IconButton } from '../Button';
import { isEditingTarget, registerPagePaste } from './pagePaste';
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
  /** Main instruction inside the drop area. */
  dropLabel?: ReactNode;
  /** Keyboard paste hint below the file formats. */
  pasteHint?: ReactNode;
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
  /** Support page-wide Ctrl/Cmd+V outside editors and a clipboard button. */
  allowPaste?: boolean;
  pasteLabel?: string;
  onError?: (error: Error) => void;
  messages?: Partial<Record<'size' | 'type' | 'processing' | 'clipboard', string>>;
}

export const ImageInput = forwardRef<HTMLDivElement, ImageInputProps>(function ImageInput(
  {
    label,
    hint,
    error,
    value,
    placeholder = 'JPG, PNG or WebP',
    dropLabel = 'Choose a file or drag & drop it here',
    pasteHint = 'Or paste an image with Ctrl/Cmd+V',
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
  // Keep callbacks current without unregistering/reordering recipients on every render.
  const latest = useRef({ busy, selectFile });
  useEffect(() => {
    latest.current = { busy, selectFile };
  });
  useEffect(() => {
    const element = field.current;
    if (!allowPaste || !element) return;
    return registerPagePaste({
      element,
      ready: () => !latest.current.busy && !inFlight.current,
      select: (selected) => {
        void latest.current.selectFile(selected);
      },
    });
  }, [allowPaste]);

  return (
    <div
      ref={ref}
      {...rest}
      onPaste={(event) => {
        onPaste?.(event);
        if (event.defaultPrevented || !allowPaste || busy || isEditingTarget(event.target)) return;
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
        aria-disabled={busy || undefined}
        aria-busy={loading || processing || undefined}
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
        {!value && (
          <>
            <span className="vui-image-input__title">{dropLabel}</span>
            <span className="vui-image-input__text">{placeholder}</span>
            {allowPaste && pasteHint && <span className="vui-image-input__text">{pasteHint}</span>}
          </>
        )}
        <span className="vui-image-input__actions" onClick={(event) => event.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            loading={loading || processing}
            onClick={pick}
            type="button"
          >
            {value ? replaceLabel : uploadLabel}
          </Button>
          {allowPaste && (
            <Button
              size="sm"
              variant="outline"
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
          {value && onRemove && (
            <IconButton
              size="sm"
              variant="outline"
              icon={<CloseIcon />}
              aria-label={removeLabel}
              disabled={busy}
              onClick={() => {
                setLocalError(null);
                onRemove();
              }}
            />
          )}
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
      {message != null && (
        <div className="vui-image-input__hint" id={hintId} role={invalid ? 'alert' : undefined}>
          {message}
        </div>
      )}
    </div>
  );
});
