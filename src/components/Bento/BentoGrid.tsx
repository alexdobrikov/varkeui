import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { responsiveVars, type Responsive } from '../../utils/responsive';
import { toCssSize } from '../../utils/toCssSize';

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Число колонок. Брейкпоинты sm / md / lg — 640 / 768 / 1024 px ширины самой сетки.
   * @default 2
   */
  columns?: Responsive<number>;
  /**
   * Высота одной строки: `200`, `'14rem'`, `'auto'`.
   * @default 200
   */
  rowHeight?: Responsive<string | number>;
  /**
   * Расстояние между карточками.
   * @default 16
   */
  gap?: string | number;
  /** Заполнять дырки в сетке карточками, которые идут дальше по порядку. */
  dense?: boolean;
}

const sizeValue = (value: Responsive<string | number> | undefined) =>
  value !== undefined && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).map(([key, v]) => [key, toCssSize(v)]))
    : toCssSize(value);

export const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(function BentoGrid(
  { columns, rowHeight, gap, dense, className, style, children, ...rest },
  ref,
) {
  const vars = {
    ...responsiveVars('--vui-bento-columns', columns),
    ...responsiveVars('--vui-bento-row-height', sizeValue(rowHeight)),
    '--vui-bento-gap': toCssSize(gap),
  } as CSSProperties;

  return (
    <div ref={ref} {...rest} className={cx('vui-bento', className)} style={{ ...vars, ...style }}>
      <div className={cx('vui-bento__grid', dense && 'vui-bento__grid--dense')}>{children}</div>
    </div>
  );
});
