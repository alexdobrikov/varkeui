import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';

export interface SegmentedControlOption {
  value: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  /** Подпись для скринридеров, если у сегмента только иконка. */
  'aria-label'?: string;
}

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  options: SegmentedControlOption[];
  /** Выбранное значение — для контролируемого режима. */
  value?: string;
  /** Начальное значение. По умолчанию — первый сегмент. */
  defaultValue?: string;
  /** Вызывается с новым значением. */
  onValueChange?: (value: string) => void;
  /** Имя для форм. По умолчанию генерируется. */
  name?: string;
  /**
   * Высота: 40, 48 или 56 px.
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /** Растянуть на ширину контейнера, сегменты делят её поровну. */
  block?: boolean;
  disabled?: boolean;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      options,
      value,
      defaultValue,
      onValueChange,
      name,
      size = 'md',
      block,
      disabled,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const generatedName = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
    const current = value !== undefined ? value : inner;
    const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

    useIsomorphicLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const measure = () => {
        const checked = root.querySelector<HTMLElement>('.vui-segmented__item--checked');
        setIndicator(checked ? { left: checked.offsetLeft, width: checked.offsetWidth } : null);
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      observer.observe(root);
      return () => observer.disconnect();
    }, [current, options]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) setInner(event.target.value);
      onValueChange?.(event.target.value);
    };

    const indicatorStyle = indicator
      ? ({ transform: `translateX(${indicator.left}px)`, width: indicator.width } as CSSProperties)
      : undefined;

    return (
      <div
        ref={mergeRefs(rootRef, ref)}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        {...rest}
        className={cx(
          'vui-segmented',
          `vui-segmented--${size}`,
          block && 'vui-segmented--block',
          indicator && 'vui-segmented--measured',
          disabled && 'vui-segmented--disabled',
          className,
        )}
        style={style}
      >
        <span className="vui-segmented__indicator" style={indicatorStyle} aria-hidden="true" />
        {options.map((option) => {
          const checked = option.value === current;
          return (
            <label
              key={option.value}
              className={cx(
                'vui-segmented__item',
                checked && 'vui-segmented__item--checked',
                option.disabled && 'vui-segmented__item--disabled',
              )}
            >
              <input
                type="radio"
                className="vui-segmented__input"
                name={name ?? generatedName}
                value={option.value}
                checked={checked}
                disabled={disabled || option.disabled}
                aria-label={option['aria-label']}
                onChange={handleChange}
              />
              {option.icon != null && (
                <span className="vui-segmented__icon" aria-hidden="true">
                  {option.icon}
                </span>
              )}
              {option.label != null && <span className="vui-segmented__label">{option.label}</span>}
            </label>
          );
        })}
      </div>
    );
  },
);
