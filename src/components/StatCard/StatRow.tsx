import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { toCssSize } from '../../utils/toCssSize';

export interface StatRowProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Ширина обычных карточек рядом с главной.
   * @default 176
   */
  itemWidth?: string | number;
  /**
   * Расстояние между карточками.
   * @default 16
   */
  gap?: string | number;
}

export const StatRow = forwardRef<HTMLDivElement, StatRowProps>(function StatRow(
  { itemWidth, gap, className, style, children, ...rest },
  ref,
) {
  const vars = {
    '--vui-stat-row-item-width': toCssSize(itemWidth),
    '--vui-stat-row-gap': toCssSize(gap),
  } as CSSProperties;

  return (
    <div
      ref={ref}
      {...rest}
      className={cx('vui-stat-row', className)}
      style={{ ...vars, ...style }}
    >
      <div className="vui-stat-row__items">{children}</div>
    </div>
  );
});
