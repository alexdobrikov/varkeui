import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { imagePositionVars, type ImagePosition } from '../../utils/imagePosition';
import { responsiveVars, type Responsive } from '../../utils/responsive';
import { toCssSize } from '../../utils/toCssSize';

interface BentoCardOwnProps {
  title?: ReactNode;
  description?: ReactNode;
  /** URL картинки или любой React-узел. */
  image?: ReactNode;
  imageAlt?: string;
  imagePosition?: ImagePosition;
  /** Размер области под картинку относительно карточки: `'70%'`, `160`. */
  imageSize?: string | number;
  imageFit?: 'contain' | 'cover';
  /** Сколько колонок занимает карточка. */
  colSpan?: Responsive<number>;
  /** Сколько строк занимает карточка. */
  rowSpan?: Responsive<number>;
  /** Фон карточки: цвет, градиент, `url(...)`. */
  background?: string;
  /** Компонент для корня, например `Link` из роутера. */
  as?: ElementType;
  disabled?: boolean;
  children?: ReactNode;
}

export type BentoCardProps<C extends ElementType = 'a'> = BentoCardOwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof BentoCardOwnProps>;

const BentoCardBase = forwardRef(function BentoCard(
  {
    title,
    description,
    image,
    imageAlt = '',
    imagePosition = 'bottom-right',
    imageSize,
    imageFit,
    colSpan,
    rowSpan,
    background,
    as,
    disabled,
    className,
    style,
    children,
    ...rest
  }: BentoCardProps<ElementType>,
  ref: Ref<Element>,
) {
  const interactive = as !== undefined || rest.href !== undefined || rest.onClick !== undefined;
  const Component: ElementType =
    as ?? (rest.href !== undefined ? 'a' : rest.onClick !== undefined ? 'button' : 'div');

  const { justify, align, objectPosition } = imagePositionVars(imagePosition);
  const vars = {
    ...responsiveVars('--vui-bento-col-span', colSpan),
    ...responsiveVars('--vui-bento-row-span', rowSpan),
    '--vui-bento-card-bg': background,
    '--vui-bento-image-justify': justify,
    '--vui-bento-image-align': align,
    '--vui-bento-image-position': objectPosition,
    '--vui-bento-image-size': toCssSize(imageSize),
    '--vui-bento-image-fit': imageFit,
  } as CSSProperties;

  const disabledProps =
    Component === 'button'
      ? { type: 'button', disabled }
      : disabled
        ? { 'aria-disabled': true, tabIndex: -1 }
        : {};

  return (
    <Component
      ref={ref}
      {...disabledProps}
      {...rest}
      className={cx('vui-bento-card', interactive && 'vui-bento-card--interactive', className)}
      style={{ ...vars, ...style }}
    >
      {image != null && (
        <span className="vui-bento-card__media">
          <span className="vui-bento-card__image">
            {typeof image === 'string' ? (
              <img src={image} alt={imageAlt} draggable={false} />
            ) : (
              image
            )}
          </span>
        </span>
      )}
      {title != null && <span className="vui-bento-card__title">{title}</span>}
      {description != null && <span className="vui-bento-card__description">{description}</span>}
      {children}
    </Component>
  );
});

export const BentoCard = BentoCardBase as <C extends ElementType = 'a'>(
  props: BentoCardProps<C> & { ref?: Ref<Element> },
) => ReactElement | null;
