import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface LevelMeterProps extends HTMLAttributes<HTMLSpanElement> {
  /** Сколько делений закрашено: 0…`max`. */
  value: number;
  /**
   * Сколько делений всего.
   * @default 3
   */
  max?: number;
  /**
   * Подпись для скринридеров: «Сложность: начальный». Без неё шкала декоративная и
   * скрыта от скринридеров — тогда уровень должен быть написан текстом рядом.
   */
  label?: string;
}

/** Высота столбика в процентах: от 40% у первого до 100% у последнего. */
const barHeight = (index: number, steps: number): number =>
  steps === 1 ? 100 : Math.round(40 + (60 * index) / (steps - 1));

/**
 * Шкала из столбиков растущей высоты, как индикатор сигнала: сложность, уровень, сила.
 * Размер — от `font-size`: высота шкалы 0.84em. Цвет закрашенных делений — `currentColor`.
 */
export const LevelMeter = forwardRef<HTMLSpanElement, LevelMeterProps>(function LevelMeter(
  { value, max = 3, label, className, ...rest },
  ref,
) {
  const steps = Math.max(1, Math.round(max));
  const filled = Math.min(steps, Math.max(0, Math.round(value)));
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <span ref={ref} {...a11y} {...rest} className={cx('vui-level-meter', className)}>
      {Array.from({ length: steps }, (_, i) => (
        <span
          key={i}
          className={cx('vui-level-meter__bar', i < filled && 'vui-level-meter__bar--on')}
          style={{ height: `${barHeight(i, steps)}%` }}
        />
      ))}
    </span>
  );
});
