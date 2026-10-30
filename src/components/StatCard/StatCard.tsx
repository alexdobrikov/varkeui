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

interface StatCardOwnProps {
  /** Главное значение крупным шрифтом: время, температура, сумма, счёт. */
  value?: ReactNode;
  /** Подпись в левом верхнем углу: «Ближайшее занятие», «Баланс». */
  label?: ReactNode;
  /** Плашка в правом верхнем углу: «завтра», «+4,2%», день недели. */
  tag?: ReactNode;
  /** Строка над `title` приглушённым цветом. */
  caption?: ReactNode;
  /** Пояснение к значению: дата, город, период. */
  title?: ReactNode;
  /**
   * Главная карточка: `title` слева, значение справа и крупнее. В `StatRow` занимает всё
   * свободное место, остальные карточки — узкие колонки справа.
   */
  featured?: boolean;
  /**
   * К какому краю прижать текст в обычной карточке. На `featured` не влияет.
   * @default end
   */
  align?: 'start' | 'end';
  /** Цвет подложки. Главная карточка заливается им на 55%, обычная — на 25%. */
  color?: string;
  /** Компонент для корня, например `Link` из роутера. */
  as?: ElementType;
  /** Неактивная карточка: не кликается и пропадает из порядка табуляции. */
  disabled?: boolean;
}

export type StatCardProps<C extends ElementType = 'a'> = StatCardOwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof StatCardOwnProps | 'children'>;

const StatCardBase = forwardRef(function StatCard(
  {
    value,
    label,
    tag,
    caption,
    title,
    featured,
    align = 'end',
    color,
    as,
    disabled,
    className,
    style,
    ...rest
  }: StatCardProps<ElementType>,
  ref: Ref<Element>,
) {
  const interactive = as !== undefined || rest.href !== undefined || rest.onClick !== undefined;
  const Component: ElementType =
    as ?? (rest.href !== undefined ? 'a' : rest.onClick !== undefined ? 'button' : 'div');

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
      className={cx(
        'vui-stat',
        featured ? 'vui-stat--featured' : `vui-stat--${align}`,
        color !== undefined && 'vui-stat--tinted',
        interactive && 'vui-stat--interactive',
        className,
      )}
      style={{ '--vui-stat-color': color, ...style } as CSSProperties}
    >
      {(label != null || tag != null) && (
        <span className="vui-stat__head">
          {label != null && <span className="vui-stat__label">{label}</span>}
          {tag != null && <span className="vui-stat__tag">{tag}</span>}
        </span>
      )}
      <span className="vui-stat__body">
        {(caption != null || title != null) && (
          <span className="vui-stat__text">
            {caption != null && <span className="vui-stat__caption">{caption}</span>}
            {title != null && <span className="vui-stat__title">{title}</span>}
          </span>
        )}
        {value != null && <span className="vui-stat__value">{value}</span>}
      </span>
    </Component>
  );
});

export const StatCard = StatCardBase as <C extends ElementType = 'a'>(
  props: StatCardProps<C> & { ref?: Ref<Element> },
) => ReactElement | null;
