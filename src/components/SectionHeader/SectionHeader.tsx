import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { ChevronRightIcon } from '../../icons';
import { cx } from '../../utils/cx';

export interface SectionHeaderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'onClick'
> {
  title: ReactNode;
  /** Текст под заголовком. */
  subtitle?: ReactNode;
  /**
   * Тег заголовка — под уровень в структуре страницы.
   * @default h2
   */
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * Размер заголовка: 20, 24 или 32 px.
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
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
              <ChevronRightIcon className="vui-section-header__chevron" />
            </Link>
          ) : (
            title
          )}
        </Heading>
        {subtitle != null && <p className="vui-section-header__subtitle">{subtitle}</p>}
      </div>
      {action != null && <div className="vui-section-header__action">{action}</div>}
    </div>
  );
});
