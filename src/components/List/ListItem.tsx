import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { toCssSize } from '../../utils/toCssSize';

export type ListItemSize = 'sm' | 'md' | 'lg';

interface ListItemOwnProps {
  /** Заголовок пункта. */
  title?: ReactNode;
  /** Подзаголовок, приглушённым цветом. */
  subtitle?: ReactNode;
  /** URL картинки или любой React-узел. */
  icon?: ReactNode;
  /** alt для иконки, если `icon` — URL. */
  iconAlt?: string;
  /** Сторона квадрата под иконку. Перебивает `size`. */
  iconSize?: string | number;
  /** Слот справа: стрелка, переключатель, счётчик. */
  after?: ReactNode;
  /**
   * Размер иконки и текста: иконка 32, 48 или 72 px.
   * @default md
   */
  size?: ListItemSize;
  /**
   * Выравнивание иконки и правого слота по вертикали.
   * @default center
   */
  align?: 'center' | 'start';
  /**
   * Сколько строк заголовка показывать до многоточия.
   * @default 2
   */
  titleLines?: number;
  /**
   * Сколько строк подзаголовка показывать до многоточия.
   * @default 3
   */
  subtitleLines?: number;
}

export type ListItemProps = ListItemOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof ListItemOwnProps> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel' | 'download'> & {
    /** Работает только для кликабельного пункта (`onClick` или `href`). */
    disabled?: boolean;
  };

export const ListItem = forwardRef<HTMLElement, ListItemProps>(function ListItem(props, ref) {
  const {
    title,
    subtitle,
    icon,
    iconAlt = '',
    iconSize,
    after,
    size = 'md',
    align = 'center',
    titleLines,
    subtitleLines,
    disabled,
    className,
    style,
    ...rest
  } = props;

  const vars = {
    '--vui-list-item-icon-size': toCssSize(iconSize),
    '--vui-list-item-title-lines': titleLines,
    '--vui-list-item-subtitle-lines': subtitleLines,
  } as CSSProperties;

  const interactive = rest.href !== undefined || rest.onClick !== undefined;

  const classes = cx(
    'vui-list-item',
    `vui-list-item--${size}`,
    align === 'start' && 'vui-list-item--align-start',
    interactive && 'vui-list-item--interactive',
    className,
  );

  const content = (
    <>
      {icon != null && (
        <span className="vui-list-item__icon">
          {typeof icon === 'string' ? <img src={icon} alt={iconAlt} draggable={false} /> : icon}
        </span>
      )}
      <span className="vui-list-item__body">
        {title != null && <span className="vui-list-item__title">{title}</span>}
        {subtitle != null && <span className="vui-list-item__subtitle">{subtitle}</span>}
      </span>
      {after != null && <span className="vui-list-item__after">{after}</span>}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        {...rest}
        className={classes}
        style={{ ...vars, ...style }}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : rest.tabIndex}
      >
        {content}
      </a>
    );
  }

  if (rest.onClick !== undefined) {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        disabled={disabled}
        className={classes}
        style={{ ...vars, ...style }}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      {...rest}
      className={classes}
      style={{ ...vars, ...style }}
    >
      {content}
    </div>
  );
});
