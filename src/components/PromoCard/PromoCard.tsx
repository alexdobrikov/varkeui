import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { CloseIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { imagePositionVars, type ImagePosition } from '../../utils/imagePosition';
import { toCssSize } from '../../utils/toCssSize';

export type PromoCardTone = 'dark' | 'light' | 'neutral';
export type PromoCardSize = 'sm' | 'md' | 'lg';

export interface PromoCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Крупный заголовок. */
  title?: ReactNode;
  /** Текст под заголовком. */
  description?: ReactNode;
  /** URL картинки или любой React-узел. */
  image?: ReactNode;
  /** alt для картинки, если `image` — URL. По умолчанию пустой: картинка декоративная. */
  imageAlt?: string;
  /**
   * Ширина колонки под картинку: `'40%'`, `160`.
   * @default 42%
   */
  imageSize?: string | number;
  /**
   * К какому краю или углу колонки прижать картинку.
   * @default top-right
   */
  imagePosition?: ImagePosition;
  /** Выпустить картинку за верхний край карточки. Число — насколько, в px. `true` — на 24px. */
  imageBleed?: boolean | number;
  /** Кнопки под текстом. В узкой карточке растягиваются на всю ширину. */
  action?: ReactNode;
  /** Показать крестик. Вызывается при клике на него — скрывать карточку решаете вы. */
  onClose?: () => void;
  /**
   * Подпись крестика для скринридеров.
   * @default Close
   */
  closeLabel?: string;
  /**
   * `dark` — тёмная карточка в любой теме, `light` — светлая, `neutral` — фон `surface` текущей темы.
   * Кнопки внутри берут цвета тона, поэтому `Button` по умолчанию контрастный.
   * @default dark
   */
  tone?: PromoCardTone;
  /** Свой фон: цвет, градиент, `url(...)`. Цвет текста по-прежнему задаёт `tone`. */
  background?: string;
  /**
   * Размер заголовка и отступов.
   * @default md
   */
  size?: PromoCardSize;
}

const toneTheme: Record<PromoCardTone, 'dark' | 'light' | undefined> = {
  dark: 'dark',
  light: 'light',
  neutral: undefined,
};

export const PromoCard = forwardRef<HTMLDivElement, PromoCardProps>(function PromoCard(
  {
    title,
    description,
    image,
    imageAlt = '',
    imageSize,
    imagePosition = 'top-right',
    imageBleed,
    action,
    onClose,
    closeLabel = 'Close',
    tone = 'dark',
    background,
    size = 'md',
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const { justify, align, objectPosition } = imagePositionVars(imagePosition);
  const bleed = imageBleed === true ? 24 : imageBleed || undefined;

  const vars = {
    '--vui-promo-bg': background,
    '--vui-promo-image-size': toCssSize(imageSize),
    '--vui-promo-image-justify': justify,
    '--vui-promo-image-align': align,
    '--vui-promo-image-position': objectPosition,
    '--vui-promo-image-bleed': toCssSize(bleed),
  } as CSSProperties;

  return (
    <div
      ref={ref}
      data-vui-theme={toneTheme[tone]}
      {...rest}
      className={cx(
        'vui-promo',
        `vui-promo--${tone}`,
        `vui-promo--${size}`,
        image != null && 'vui-promo--with-image',
        bleed !== undefined && 'vui-promo--bleed',
        onClose && 'vui-promo--closable',
        className,
      )}
      style={{ ...vars, ...style }}
    >
      <div className="vui-promo__layout">
        <div className="vui-promo__body">
          {title != null && <div className="vui-promo__title">{title}</div>}
          {description != null && <div className="vui-promo__description">{description}</div>}
          {children}
        </div>
        {image != null && (
          <div className="vui-promo__media">
            <div className="vui-promo__image">
              {typeof image === 'string' ? (
                <img src={image} alt={imageAlt} draggable={false} />
              ) : (
                image
              )}
            </div>
          </div>
        )}
        {action != null && <div className="vui-promo__action">{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="vui-promo__close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});
