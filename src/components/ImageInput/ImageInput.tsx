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
import { InputButton } from '../Input';

export interface ImageInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Подпись над полем. */
  label?: ReactNode;
  /** Подсказка под полем. */
  hint?: ReactNode;
  /** Текст ошибки. Подсвечивает поле и заменяет `hint`. */
  error?: ReactNode;
  /** Адрес выбранной картинки — показывается превью. */
  value?: string | null;
  /** Текст в поле, пока картинки нет. */
  placeholder?: ReactNode;
  /** Пользователь выбрал файл — кнопкой или перетащив его на поле. Загрузить и передать адрес в `value` — ваша задача. */
  onFileSelect: (file: File) => void;
  /** Показать кнопку удаления, когда картинка есть. */
  onRemove?: () => void;
  /**
   * Какие файлы принимать.
   * @default image/*
   */
  accept?: string;
  /** Идёт загрузка: крутилка вместо кнопки. */
  loading?: boolean;
  disabled?: boolean;
  /** Растянуть на ширину контейнера. */
  block?: boolean;
  /** @default Upload */
  uploadLabel?: string;
  /** @default Replace */
  replaceLabel?: string;
  /** @default Remove */
  removeLabel?: string;
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
    className,
    ...rest
  },
  ref,
) {
  const inputId = useId();
  const hintId = useId();
  const file = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const busy = loading || disabled;
  const message = error ?? hint;

  const pick = () => {
    if (!busy) file.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) onFileSelect(selected);
    // Тот же файл можно выбрать снова.
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped && !busy) onFileSelect(dropped);
  };

  return (
    <div
      ref={ref}
      {...rest}
      className={cx(
        'vui-image-input',
        block && 'vui-image-input--block',
        error != null && 'vui-image-input--invalid',
        disabled && 'vui-image-input--disabled',
        dragging && 'vui-image-input--dragging',
        className,
      )}
    >
      {label != null && (
        <label className="vui-image-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div
        className="vui-image-input__field"
        onClick={pick}
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
          {value && onRemove && !loading && (
            <InputButton
              aria-label={removeLabel}
              disabled={disabled}
              onClick={onRemove}
              type="button"
              variant="ghost"
            >
              <CloseIcon />
            </InputButton>
          )}
          <InputButton disabled={busy} onClick={pick} type="button">
            {loading ? (
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
      {message != null && (
        <div className="vui-image-input__hint" id={hintId}>
          {message}
        </div>
      )}
    </div>
  );
});
