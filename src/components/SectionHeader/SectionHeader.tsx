import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { ChevronRightIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { useCountUp } from '../../utils/useCountUp';

export interface SectionHeaderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'onClick'
> {
  title: ReactNode;
  /** Число рядом с заголовком приглушённым цветом: «Notifications 30». */
  count?: ReactNode;
  /**
   * Анимировать числовой `count`: при появлении он набегает от нуля, при смене — от прежнего
   * значения. Строки (`"2 of 5"`) и дробные числа выводятся как есть. При гидрации с сервера
   * и при `prefers-reduced-motion` число сразу конечное.
   * @default true
   */
  animateCount?: boolean;
  /** Текст под заголовком. */
  subtitle?: ReactNode;
  /**
   * Тег заголовка — под уровень в структуре страницы.
   * @default h2
   */
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * Размер заголовка: 15, 20, 24 или 32 px. `xs` — как подпись поля (`Input` и др.):
   * заголовок группы внутри формы или модалки.
   * @default md
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Сделать заголовок ссылкой со стрелкой. */
  href?: string;
  /** Сделать заголовок кнопкой со стрелкой. */
  onClick?: MouseEventHandler<HTMLElement>;
  /** Компонент ссылки, например `Link` из роутера. */
  linkAs?: ElementType;
  /** Пропсы для ссылки: `to` для React Router, `target`, `prefetch` и т. п. */
  linkProps?: Record<string, unknown>;
  /** Слот справа: кнопка «Все», стрелки ленты, счётчик. */
  action?: ReactNode;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(function SectionHeader(
  {
    title,
    count,
    animateCount = true,
    subtitle,
    headingAs: Heading = 'h2',
    size = 'md',
    href,
    onClick,
    linkAs,
    linkProps,
    action,
    className,
    ...rest
  },
  ref,
) {
  const linked = linkAs !== undefined || href !== undefined || onClick !== undefined;
  const Link: ElementType = linkAs ?? (href !== undefined ? 'a' : 'button');
  const buttonProps = Link === 'button' ? { type: 'button' } : {};
  const shownCount = useCountUp(count, animateCount) as ReactNode;
  const counting = shownCount !== count;
  const counter = count != null && (
    <span className="vui-section-header__count">
      {counting ? (
        <>
          {/* Скринридер читает конечное число, а не каждый кадр анимации. */}
          <span aria-hidden="true">{shownCount}</span>
          <span className="vui-section-header__count-final">{count}</span>
        </>
      ) : (
        count
      )}
    </span>
  );

  return (
    <div
      ref={ref}
      {...rest}
      className={cx('vui-section-header', `vui-section-header--${size}`, className)}
    >
      <div className="vui-section-header__titles">
        <Heading className="vui-section-header__title">
          {linked ? (
            <Link
              {...buttonProps}
              {...linkProps}
              {...(href !== undefined && { href })}
              {...(onClick !== undefined && { onClick })}
              className="vui-section-header__link"
            >
              <span>{title}</span>
              {counter}
              <ChevronRightIcon className="vui-section-header__chevron" />
            </Link>
          ) : (
            <>
              {title}
              {counter}
            </>
          )}
        </Heading>
        {subtitle != null && <p className="vui-section-header__subtitle">{subtitle}</p>}
      </div>
      {action != null && <div className="vui-section-header__action">{action}</div>}
    </div>
  );
});
