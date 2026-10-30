import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { useOptionalSidebar } from './SidebarProvider';

interface SidebarItemOwnProps {
  /** Название пункта. В свёрнутом меню становится всплывающей подсказкой. */
  label: string;
  /** Иконка 24 px. Остаётся видна, когда меню свёрнуто. */
  icon?: ReactNode;
  /** Текущий раздел: пункт подсвечивается, ссылка получает `aria-current="page"`. */
  active?: boolean;
  /** Счётчик справа. Ноль скрывает его, в свёрнутом меню вместо числа — точка на иконке. */
  badge?: number;
  /** Красный пункт для опасных действий: «Выйти», «Удалить аккаунт». */
  danger?: boolean;
  /** Компонент для корня, например `Link` из роутера. */
  as?: ElementType;
  disabled?: boolean;
}

export type SidebarItemProps<C extends ElementType = 'a'> = SidebarItemOwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof SidebarItemOwnProps>;

// Пропсы корня зависят от `as`, поэтому внутри они нетипизированы; снаружи тип даёт `SidebarItem` ниже.
type LooseProps = SidebarItemOwnProps &
  Omit<AnchorHTMLAttributes<HTMLElement>, keyof SidebarItemOwnProps>;

const SidebarItemBase = forwardRef<Element, LooseProps>(function SidebarItem(
  { label, icon, active, badge, danger, as, disabled, className, onClick, ...rest },
  ref,
) {
  const sidebar = useOptionalSidebar();
  const Component: ElementType = as ?? (rest.href !== undefined ? 'a' : 'button');
  const isButton = Component === 'button';
  const count = badge !== undefined && badge > 0 ? (badge > 99 ? '99+' : String(badge)) : null;

  // Выбор пункта на телефоне закрывает выезжающую панель — и для ссылок, и для кнопок.
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick?.(e);
    sidebar?.setOpen(false);
  };

  return (
    <li className="vui-sidebar-item__row">
      <Component
        ref={ref}
        {...(isButton
          ? { type: 'button', disabled }
          : disabled
            ? { 'aria-disabled': true, tabIndex: -1 }
            : {})}
        {...rest}
        onClick={handleClick}
        className={cx(
          'vui-sidebar-item',
          active && 'vui-sidebar-item--active',
          danger && 'vui-sidebar-item--danger',
          className,
        )}
        aria-current={active && !isButton ? 'page' : undefined}
        aria-pressed={active && isButton ? true : undefined}
        title={sidebar?.collapsed ? label : undefined}
      >
        {icon != null && (
          <span className="vui-sidebar-item__icon">
            {icon}
            {count != null && <span className="vui-sidebar-item__dot" aria-hidden="true" />}
          </span>
        )}
        <span className="vui-sidebar-item__label">{label}</span>
        {count != null && <span className="vui-sidebar-item__badge">{count}</span>}
      </Component>
    </li>
  );
});

/** Пункт меню. С `href` — ссылка, с `onClick` — кнопка, `as` — свой компонент. */
export const SidebarItem = SidebarItemBase as <C extends ElementType = 'a'>(
  props: SidebarItemProps<C> & { ref?: Ref<Element> },
) => ReactElement | null;
