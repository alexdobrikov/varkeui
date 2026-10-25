import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { toCssSize } from '../../utils/toCssSize';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * `rect` — блок, `circle` — круг для аватаров и иконок, `text` — строки текста.
   * @default rect
   */
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  /** Скругление. По умолчанию зависит от `variant`. */
  radius?: string | number;
  /**
   * Сколько строк у `variant="text"`. Последняя короче, как у настоящего абзаца.
   * @default 1
   */
  lines?: number;
  /**
   * Перелив, пока данные грузятся.
   * @default true
   */
  animated?: boolean;
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  {
    variant = 'rect',
    width,
    height,
    radius,
    lines = 1,
    animated = true,
    className,
    style,
    ...rest
  },
  ref,
) {
  const vars = {
    '--vui-skeleton-width': toCssSize(width),
    '--vui-skeleton-height': toCssSize(height),
    '--vui-skeleton-radius': toCssSize(radius),
  } as CSSProperties;

  const classes = cx(
    'vui-skeleton',
    `vui-skeleton--${variant}`,
    animated && 'vui-skeleton--animated',
    className,
  );

  if (variant === 'text' && lines > 1) {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        {...rest}
        className={cx('vui-skeleton-lines', className)}
        style={{ ...vars, ...style }}
      >
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className={cx(
              'vui-skeleton',
              'vui-skeleton--text',
              animated && 'vui-skeleton--animated',
              index === lines - 1 && 'vui-skeleton--last-line',
            )}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      aria-hidden="true"
      {...rest}
      className={classes}
      style={{ ...vars, ...style }}
    />
  );
});
