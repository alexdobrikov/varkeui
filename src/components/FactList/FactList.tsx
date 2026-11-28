import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface FactListProps extends HTMLAttributes<HTMLDListElement> {
  /**
   * Размер значков и текста во всех фактах: значок 20, 24 или 28 px.
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
  /** Факты — компоненты `Fact`. */
  children?: ReactNode;
}

/**
 * Строка фактов о материале: уровень, дата, время чтения, длительность, автор.
 * Это список определений `<dl>`: подпись — `<dt>`, значение — `<dd>`.
 */
export const FactList = forwardRef<HTMLDListElement, FactListProps>(function FactList(
  { size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <dl ref={ref} {...rest} className={cx('vui-facts', `vui-facts--${size}`, className)}>
      {children}
    </dl>
  );
});

export interface FactProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Значок слева: иконка или `LevelMeter`. Декоративный — скринридер его не читает. */
  icon?: ReactNode;
  /** Подпись приглушённым цветом над значением: «Уровень», «Опубликовано». */
  label: ReactNode;
  /** Значение: «Начальный · HSK 1–3», «27 ноября 2026», `<time>`. */
  children: ReactNode;
}

/** Один факт: значок, подпись и значение. Только внутри `FactList`. */
export const Fact = forwardRef<HTMLDivElement, FactProps>(function Fact(
  { icon, label, children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} {...rest} className={cx('vui-fact', className)}>
      {icon != null && (
        <span className="vui-fact__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="vui-fact__text">
        <dt className="vui-fact__label">{label}</dt>
        <dd className="vui-fact__value">{children}</dd>
      </span>
    </div>
  );
});
