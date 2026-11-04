import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { InputSize, InputVariant } from '../Input';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Same heights as Input: 40, 48 and 56 px. */
  size?: InputSize;
  variant?: InputVariant;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  startIcon?: ReactNode;
  block?: boolean;
}

/** Native platform picker, styled like Input. Options remain native <option> elements. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    size = 'md',
    variant = 'filled',
    label,
    hint,
    error,
    invalid,
    startIcon,
    block,
    className,
    style,
    id,
    disabled,
    children,
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const message = error ?? hint;
  const hintId = `${selectId}-hint`;
  const isInvalid = invalid || error != null;
  return (
    <div
      className={cx(
        'vui-input',
        'vui-select',
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
        <label className="vui-input__label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className="vui-input__field vui-select__field">
        {startIcon != null && (
          <span className="vui-input__icon vui-select__start" aria-hidden="true">
            {startIcon}
          </span>
        )}
        <select
          {...rest}
          ref={ref}
          id={selectId}
          className="vui-input__control vui-select__control"
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-describedby={
            [describedBy, message != null ? hintId : null].filter(Boolean).join(' ') || undefined
          }
        >
          {children}
        </select>
        <span className="vui-input__icon vui-select__arrow" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
      {message != null && (
        <div className="vui-input__hint" id={hintId}>
          {message}
        </div>
      )}
    </div>
  );
});
