import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { CloseIcon } from '../../icons';
import { cx } from '../../utils/cx';

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  /** Иконка, эмодзи или аватар перед текстом. */
  icon?: ReactNode;
  /** Выбранный фильтр. С этим пропом чип становится переключателем с `aria-pressed`. */
  selected?: boolean;
  /** Вызывается с новым состоянием выбора. */
  onSelectedChange?: (selected: boolean) => void;
  /** Делает чип кнопкой. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Показать крестик. Вызывается при клике на него. */
  onRemove?: () => void;
  /**
   * Подпись крестика для скринридеров.
   * @default Remove
   */
  removeLabel?: string;
  /**
   * Высота: 32 или 40 px.
   * @default md
   */
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
    icon,
    selected,
    onSelectedChange,
    onClick,
    onRemove,
    removeLabel = 'Remove',
    size = 'md',
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  const toggleable = selected !== undefined || onSelectedChange !== undefined;
  const interactive = toggleable || onClick !== undefined;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (toggleable) onSelectedChange?.(!selected);
  };

  const content = (
    <>
      {icon != null && (
        <span className="vui-chip__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="vui-chip__label">{children}</span>
    </>
  );

  return (
    <span
      ref={ref}
      {...rest}
      className={cx(
        'vui-chip',
        `vui-chip--${size}`,
        interactive && 'vui-chip--interactive',
        selected && 'vui-chip--selected',
        onRemove && 'vui-chip--removable',
        disabled && 'vui-chip--disabled',
        className,
      )}
    >
      {interactive ? (
        <button
          type="button"
          className="vui-chip__main"
          aria-pressed={toggleable ? Boolean(selected) : undefined}
          disabled={disabled}
          onClick={handleClick}
        >
          {content}
        </button>
      ) : (
        <span className="vui-chip__main">{content}</span>
      )}
      {onRemove && (
        <button
          type="button"
          className="vui-chip__remove"
          aria-label={typeof children === 'string' ? `${removeLabel} ${children}` : removeLabel}
          disabled={disabled}
          onClick={onRemove}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
});
