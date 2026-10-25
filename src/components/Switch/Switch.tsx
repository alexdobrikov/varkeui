import {
  forwardRef,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Размер: 40×24 или 52×32 px.
   * @default md
   */
  size?: 'sm' | 'md';
  /** Подпись рядом. Клик по ней тоже переключает. */
  label?: ReactNode;
  /**
   * С какой стороны подпись.
   * @default start
   */
  labelPosition?: 'start' | 'end';
  /** Вызывается с новым значением — удобнее, чем доставать его из события. */
  onCheckedChange?: (checked: boolean) => void;
  /** Класс корневого элемента. */
  className?: string;
  /** Стили корневого элемента. */
  style?: CSSProperties;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    size = 'md',
    label,
    labelPosition = 'start',
    onChange,
    onCheckedChange,
    className,
    style,
    disabled,
    ...rest
  },
  ref,
) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  };

  const control = (
    <span
      className={cx('vui-switch', `vui-switch--${size}`, label == null && className)}
      style={label == null ? style : undefined}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className="vui-switch__input"
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      <span className="vui-switch__track" aria-hidden="true">
        <span className="vui-switch__thumb" />
      </span>
    </span>
  );

  if (label == null) return control;

  return (
    <label
      className={cx(
        'vui-switch-field',
        labelPosition === 'end' && 'vui-switch-field--label-end',
        disabled && 'vui-switch-field--disabled',
        className,
      )}
      style={style}
    >
      <span className="vui-switch-field__label">{label}</span>
      {control}
    </label>
  );
});
