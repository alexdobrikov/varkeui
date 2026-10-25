import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export type BadgeTone = 'neutral' | 'accent' | 'danger' | 'success';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Цвет: `neutral` — фон поверхности, `accent` — контрастный, `danger` — красный,
   * `success` — зелёный.
   * @default neutral
   */
  tone?: BadgeTone;
  /**
   * Высота: 20 или 24 px.
   * @default md
   */
  size?: 'sm' | 'md';
  /** Число вместо текста. Больше `max` показывается как `99+`, ноль скрывает бейдж. */
  count?: number;
  /**
   * Предел для `count`.
   * @default 99
   */
  max?: number;
  /** Показывать бейдж при `count={0}`. */
  showZero?: boolean;
  /** Точка без текста. Для скринридеров добавьте `aria-label`. */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', size = 'md', count, max = 99, showZero, dot, className, children, ...rest },
  ref,
) {
  if (count !== undefined && count <= 0 && !showZero && !dot) return null;

  const content = dot ? null : count !== undefined ? (count > max ? `${max}+` : count) : children;

  return (
    <span
      ref={ref}
      {...rest}
      className={cx(
        'vui-badge',
        `vui-badge--${tone}`,
        `vui-badge--${size}`,
        dot && 'vui-badge--dot',
        className,
      )}
    >
      {content}
    </span>
  );
});
