import {
  forwardRef,
  useEffect,
  useRef,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  /** Подпись справа. Клик по ней тоже переключает. */
  label?: ReactNode;
  /** Пояснение под подписью. */
  description?: ReactNode;
  /** Состояние «выбрано частично» — например, у «Выбрать все», когда выбраны не все. */
  indeterminate?: boolean;
  /**
   * Сторона квадрата: 18 или 22 px.
   * @default md
   */
  size?: 'sm' | 'md';
  /** Подсветить как ошибочный. */
  invalid?: boolean;
  /** Вызывается с новым значением. */
  onCheckedChange?: (checked: boolean) => void;
  /** Класс корневого элемента. */
  className?: string;
  /** Стили корневого элемента. */
  style?: CSSProperties;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    indeterminate = false,
    size = 'md',
    invalid,
    onChange,
    onCheckedChange,
    className,
    style,
    disabled,
    ...rest
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  };

  return (
    <label
      className={cx(
        'vui-check',
        `vui-check--${size}`,
        invalid && 'vui-check--invalid',
        disabled && 'vui-check--disabled',
        className,
      )}
      style={style}
    >
      <span className="vui-check__control">
        <input
          ref={mergeRefs(inputRef, ref)}
          type="checkbox"
          className="vui-check__input"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={handleChange}
          {...rest}
        />
        <span className="vui-check__box" aria-hidden="true">
          <svg className="vui-check__mark" viewBox="0 0 16 16" fill="none">
            <path
              d="M3.5 8.5l3 3 6-7"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg className="vui-check__dash" viewBox="0 0 16 16" fill="none">
            <path d="M4 8h8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
          </svg>
        </span>
      </span>
      {(label != null || description != null) && (
        <span className="vui-check__text">
          {label != null && <span className="vui-check__label">{label}</span>}
          {description != null && <span className="vui-check__description">{description}</span>}
        </span>
      )}
    </label>
  );
});
