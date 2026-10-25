import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  /** Подсказка под полем. */
  hint?: ReactNode;
  /** Текст ошибки. Подсвечивает поле и заменяет `hint`. */
  error?: ReactNode;
  /** Подсветить поле как ошибочное без текста. */
  invalid?: boolean;
  /**
   * `filled` — с фоном, `outlined` — с обводкой.
   * @default filled
   */
  variant?: 'filled' | 'outlined';
  /** Растянуть на ширину контейнера. */
  block?: boolean;
  /**
   * Растягивать поле по высоте вместе с текстом.
   * @default true
   */
  autoResize?: boolean;
  /**
   * Минимальная высота в строках.
   * @default 3
   */
  minRows?: number;
  /** Максимальная высота в строках, дальше появляется прокрутка. */
  maxRows?: number;
  /** Показать счётчик символов. С `maxLength` — в виде `120 / 500`. */
  showCount?: boolean;
  /** Класс корневого элемента. */
  className?: string;
  /** Стили корневого элемента. */
  style?: CSSProperties;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hint,
    error,
    invalid,
    variant = 'filled',
    block,
    autoResize = true,
    minRows = 3,
    maxRows,
    showCount,
    className,
    style,
    id,
    disabled,
    value,
    defaultValue,
    maxLength,
    onChange,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const hintId = `${textareaId}-hint`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [innerLength, setInnerLength] = useState(String(defaultValue ?? '').length);
  const length = value !== undefined ? String(value).length : innerLength;

  const isInvalid = invalid || error != null;
  const message = error ?? hint;

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize) return;
    const styles = getComputedStyle(textarea);
    const lineHeight = parseFloat(styles.lineHeight) || 22;
    const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    textarea.style.height = 'auto';
    const min = minRows * lineHeight + padding;
    const max = maxRows ? maxRows * lineHeight + padding : Infinity;
    const next = Math.min(Math.max(textarea.scrollHeight, min), max);
    textarea.style.height = `${next}px`;
    textarea.style.overflowY = textarea.scrollHeight > max ? 'auto' : 'hidden';
  }, [autoResize, minRows, maxRows]);

  useIsomorphicLayoutEffect(resize, [resize, value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInnerLength(event.target.value.length);
    onChange?.(event);
    resize();
  };

  return (
    <div
      className={cx(
        'vui-input',
        'vui-textarea',
        `vui-input--${variant}`,
        block && 'vui-input--block',
        isInvalid && 'vui-input--invalid',
        disabled && 'vui-input--disabled',
        !autoResize && 'vui-textarea--resizable',
        className,
      )}
      style={style}
    >
      {label != null && (
        <label className="vui-input__label" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <div className="vui-input__field vui-textarea__field">
        <textarea
          ref={mergeRefs(textareaRef, ref)}
          id={textareaId}
          className="vui-textarea__control"
          rows={minRows}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          aria-invalid={isInvalid || undefined}
          aria-describedby={message != null ? hintId : undefined}
          onChange={handleChange}
          {...rest}
        />
      </div>
      {(message != null || showCount) && (
        <div className="vui-textarea__footer">
          {message != null && (
            <div className="vui-input__hint" id={hintId}>
              {message}
            </div>
          )}
          {showCount && (
            <div className="vui-textarea__count" aria-hidden="true">
              {maxLength ? `${length} / ${maxLength}` : length}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
