import {
  forwardRef,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useRadioGroup } from './RadioGroup';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value'
> {
  value: string;
  label?: ReactNode;
  /** Пояснение под подписью. */
  description?: ReactNode;
  /**
   * Размер кружка. Внутри `RadioGroup` берётся из группы.
   * @default md
   */
  size?: 'sm' | 'md';
  /** Класс корневого элемента. */
  className?: string;
  /** Стили корневого элемента. */
  style?: CSSProperties;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, size, className, style, disabled, onChange, ...rest },
  ref,
) {
  const group = useRadioGroup();
  const isDisabled = disabled || group?.disabled;
  const resolvedSize = size ?? group?.size ?? 'md';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    group?.onChange(event);
  };

  const groupProps = group ? { name: group.name, checked: group.value === value } : {};

  return (
    <label
      className={cx(
        'vui-check',
        'vui-check--radio',
        `vui-check--${resolvedSize}`,
        isDisabled && 'vui-check--disabled',
        className,
      )}
      style={style}
    >
      <span className="vui-check__control">
        <input
          ref={ref}
          type="radio"
          className="vui-check__input"
          value={value}
          disabled={isDisabled}
          onChange={handleChange}
          {...groupProps}
          {...rest}
        />
        <span className="vui-check__box" aria-hidden="true">
          <span className="vui-check__dot" />
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
