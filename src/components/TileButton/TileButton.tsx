import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { imagePositionVars, type ImagePosition } from '../../utils/imagePosition';
import { toCssSize } from '../../utils/toCssSize';

export type TileButtonVariant = 'filled' | 'outlined';
export type TileButtonSize = 'sm' | 'md' | 'lg';
export type TileButtonImagePosition = ImagePosition;

interface TileButtonOwnProps {
  /** Текст под плиткой. */
  label?: ReactNode;
  /** URL картинки или любой React-узел (иконка, svg). */
  image?: ReactNode;
  /** alt для картинки, если `image` — URL. По умолчанию пустой: подпись уже описывает кнопку. */
  imageAlt?: string;
  /**
   * К какому краю или углу прижать картинку.
   * @default center
   */
  imagePosition?: TileButtonImagePosition;
  /** Размер картинки относительно плитки, например `80%` или `96px`. */
  imageSize?: string | number;
  /**
   * `contain` — картинка целиком, `cover` — на всю плитку.
   * @default contain
   */
  imageFit?: 'contain' | 'cover';
  /**
   * `filled` — с фоном, `outlined` — с обводкой. Размер у обоих одинаковый.
   * @default filled
   */
  variant?: TileButtonVariant;
  /**
   * Ширина плитки: 96, 128 или 160 px.
   * @default lg
   */
  size?: TileButtonSize;
  /** Ширина плитки. Перебивает `size`. */
  width?: string | number;
  /** Соотношение сторон плитки: `1`, `2.2`, `'16 / 9'`. */
  aspectRatio?: string | number;
  /** Скругление углов. По умолчанию зависит от `size`. */
  radius?: string | number;
  /** Растянуть на всю ширину контейнера. */
  block?: boolean;
  /** Элемент в правом верхнем углу, вырезанный «выемкой» цвета фона. */
  badge?: ReactNode;
  /**
   * Сколько строк подписи показывать до обрезки.
   * @default 2
   */
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

    const { justify, align, objectPosition } = imagePositionVars(imagePosition);

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
