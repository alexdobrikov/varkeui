import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';

export type TileButtonVariant = 'filled' | 'outlined';
export type TileButtonSize = 'sm' | 'md' | 'lg';
export type TileButtonImagePosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface TileButtonOwnProps {
  /** Текст под плиткой. */
  label?: ReactNode;
  /** URL картинки или любой React-узел (иконка, svg). */
  image?: ReactNode;
  imageAlt?: string;
  imagePosition?: TileButtonImagePosition;
  /** Размер картинки относительно плитки, например `80%` или `96px`. */
  imageSize?: string | number;
  imageFit?: 'contain' | 'cover';
  variant?: TileButtonVariant;
  size?: TileButtonSize;
  /** Ширина плитки. Перебивает `size`. */
  width?: string | number;
  /** Соотношение сторон плитки: `1`, `2.2`, `'16 / 9'`. */
  aspectRatio?: string | number;
  radius?: string | number;
  /** Растянуть на всю ширину контейнера. */
  block?: boolean;
  /** Элемент в правом верхнем углу, вырезанный «выемкой» цвета фона. */
  badge?: ReactNode;
  /** Сколько строк подписи показывать до обрезки. */
  labelLines?: number;
}

type ButtonProps = TileButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof TileButtonOwnProps> & { href?: undefined };

type AnchorProps = TileButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof TileButtonOwnProps> & {
    href: string;
    disabled?: boolean;
  };

export type TileButtonProps = ButtonProps | AnchorProps;

const positions: Record<TileButtonImagePosition, [string, string, string]> = {
  center: ['center', 'center', 'center'],
  top: ['center', 'flex-start', 'center top'],
  bottom: ['center', 'flex-end', 'center bottom'],
  left: ['flex-start', 'center', 'left center'],
  right: ['flex-end', 'center', 'right center'],
  'top-left': ['flex-start', 'flex-start', 'left top'],
  'top-right': ['flex-end', 'flex-start', 'right top'],
  'bottom-left': ['flex-start', 'flex-end', 'left bottom'],
  'bottom-right': ['flex-end', 'flex-end', 'right bottom'],
};

const toCssSize = (value: string | number | undefined) =>
  typeof value === 'number' ? `${value}px` : value;

export const TileButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, TileButtonProps>(
  function TileButton(props, ref) {
    const {
      label,
      image,
      imageAlt = '',
      imagePosition = 'center',
      imageSize,
      imageFit,
      variant = 'filled',
      size = 'lg',
      width,
      aspectRatio,
      radius,
      block,
      badge,
      labelLines = 2,
      className,
      style,
      ...rest
    } = props;

    const [justify, align, objectPosition] = positions[imagePosition];

    const vars = {
      '--vui-tile-width': toCssSize(width),
      '--vui-tile-ratio': aspectRatio,
      '--vui-tile-radius': toCssSize(radius),
      '--vui-tile-lines': labelLines,
      '--vui-tile-justify': justify,
      '--vui-tile-align': align,
      '--vui-tile-object-position': objectPosition,
      '--vui-tile-image-size': toCssSize(imageSize),
      '--vui-tile-image-fit': imageFit,
    } as CSSProperties;

    const classes = cx(
      'vui-tile',
      `vui-tile--${size}`,
      `vui-tile--${variant}`,
      block && 'vui-tile--block',
      labelLines === 1 && 'vui-tile--single-line',
      className,
    );

    const content = (
      <>
        <span className="vui-tile__surface">
          {image != null && (
            <span className="vui-tile__media">
              <span className="vui-tile__image">
                {typeof image === 'string' ? (
                  <img src={image} alt={imageAlt} draggable={false} />
                ) : (
                  image
                )}
              </span>
            </span>
          )}
          {badge != null && <span className="vui-tile__badge">{badge}</span>}
        </span>
        {label != null && <span className="vui-tile__label">{label}</span>}
      </>
    );

    if (rest.href !== undefined) {
      const { disabled, ...anchorProps } = rest as Omit<AnchorProps, keyof TileButtonOwnProps>;
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          {...anchorProps}
          className={classes}
          style={{ ...vars, ...style }}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : anchorProps.tabIndex}
        >
          {content}
        </a>
      );
    }

    const buttonProps = rest as Omit<ButtonProps, keyof TileButtonOwnProps>;
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        {...buttonProps}
        className={classes}
        style={{ ...vars, ...style }}
      >
        {content}
      </button>
    );
  },
);
