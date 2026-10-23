import {
  forwardRef,
  useId,
  useRef,
  type CSSProperties,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'filled' | 'outlined';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Высота поля: 40, 48 или 56 px.
   * @default md
   */
  size?: InputSize;
  /**
   * `filled` — с фоном, `outlined` — с обводкой.
   * @default filled
   */
  variant?: InputVariant;
  /** Подпись над полем. Связана с `<input>` через `id`. */
  label?: ReactNode;
  /** Подсказка под полем. */
  hint?: ReactNode;
  /** Текст ошибки. Подсвечивает поле и заменяет `hint`. */
  error?: ReactNode;
  /** Подсветить поле как ошибочное без текста. */
  invalid?: boolean;
  /** Иконка слева от текста. */
  startIcon?: ReactNode;
  /** Иконка справа от текста. */
  endIcon?: ReactNode;
  /** Кнопка внутри поля справа, обычно `InputButton`. */
  action?: ReactNode;
  /** Растянуть на ширину контейнера. */
  block?: boolean;
  /** Класс корневого элемента. */
  className?: string;
  /** Стили корневого элемента. */
  style?: CSSProperties;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    variant = 'filled',
    label,
    hint,
    error,
    invalid,
    startIcon,
    endIcon,
    action,
    block,
    className,
    style,
    id,
    disabled,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const inputRef = useRef<HTMLInputElement>(null);

  const isInvalid = invalid || error != null;
  const message = error ?? hint;

  const focusInput = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target === inputRef.current || target.closest('button, a, input')) return;
    event.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <div
      className={cx(
        'vui-input',
        `vui-input--${size}`,
        `vui-input--${variant}`,
        block && 'vui-input--block',
        isInvalid && 'vui-input--invalid',
        disabled && 'vui-input--disabled',
        className,
      )}
      style={style}
    >
      {label != null && (
        <label className="vui-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="vui-input__field" onMouseDown={focusInput}>
        {startIcon != null && <span className="vui-input__icon">{startIcon}</span>}
        <input
          ref={mergeRefs(inputRef, ref)}
          id={inputId}
          className="vui-input__control"
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={message != null ? hintId : undefined}
          {...rest}
        />
        {endIcon != null && <span className="vui-input__icon">{endIcon}</span>}
        {action != null && <span className="vui-input__action">{action}</span>}
      </div>
      {message != null && (
        <div className="vui-input__hint" id={hintId}>
          {message}
        </div>
      )}
    </div>
  );
});
