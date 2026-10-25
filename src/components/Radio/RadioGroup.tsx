import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled?: boolean;
  size: 'sm' | 'md';
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => useContext(RadioGroupContext);

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** Имя группы для форм. По умолчанию генерируется. */
  name?: string;
  /** Выбранное значение — для контролируемого режима. */
  value?: string;
  /** Начальное значение — для неконтролируемого режима. */
  defaultValue?: string;
  /** Вызывается с новым значением. */
  onValueChange?: (value: string) => void;
  /** Подпись группы. Для скринридеров обязательна: передайте её или `aria-label`. */
  label?: ReactNode;
  /**
   * Расположение пунктов.
   * @default vertical
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Размер кружков: 18 или 22 px.
   * @default md
   */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    name,
    value,
    defaultValue,
    onValueChange,
    label,
    orientation = 'vertical',
    size = 'md',
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  const generatedName = useId();
  const labelId = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInner(event.target.value);
    onValueChange?.(event.target.value);
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-labelledby={label != null ? labelId : undefined}
      aria-disabled={disabled || undefined}
      {...rest}
      className={cx('vui-radio-group', `vui-radio-group--${orientation}`, className)}
    >
      {label != null && (
        <div id={labelId} className="vui-radio-group__label">
          {label}
        </div>
      )}
      <div className="vui-radio-group__items">
        <RadioGroupContext.Provider
          value={{ name: name ?? generatedName, value: current, disabled, size, onChange }}
        >
          {children}
        </RadioGroupContext.Provider>
      </div>
    </div>
  );
});
