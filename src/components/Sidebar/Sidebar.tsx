import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useSidebar } from './SidebarProvider';

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Верх меню: обычно `SidebarBrand` и `SidebarCollapseButton`. */
  header?: ReactNode;
  /** Низ меню: переключатель темы, аккаунт, второстепенные пункты. */
  footer?: ReactNode;
  /**
   * Подпись навигации для скринридеров.
   * @default Меню
   */
  'aria-label'?: string;
}

/**
 * Боковое меню. На компьютере стоит колонкой слева и сворачивается до иконок,
 * на телефоне выезжает панелью поверх страницы по кнопке `SidebarTrigger`.
 * Работает внутри `SidebarProvider`.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { header, footer, className, children, 'aria-label': ariaLabel = 'Меню', ...rest },
  ref,
) {
  const { collapsed, open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cx('vui-sidebar-overlay', open && 'vui-sidebar-overlay--open')}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        ref={ref}
        {...rest}
        className={cx(
          'vui-sidebar',
          collapsed && 'vui-sidebar--collapsed',
          open && 'vui-sidebar--open',
          className,
        )}
        data-collapsed={collapsed || undefined}
      >
        {header != null && <div className="vui-sidebar__header">{header}</div>}
        <nav className="vui-sidebar__nav" aria-label={ariaLabel}>
          {children}
        </nav>
        {footer != null && <div className="vui-sidebar__footer">{footer}</div>}
      </aside>
    </>
  );
});

/** Основная часть страницы справа от меню. */
export const SidebarMain = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function SidebarMain({ className, ...rest }, ref) {
    return <main ref={ref} {...rest} className={cx('vui-sidebar-main', className)} />;
  },
);

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Подзаголовок группы. В свёрнутом меню скрывается. */
  label?: ReactNode;
}

/** Группа пунктов с необязательным подзаголовком. */
export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(function SidebarGroup(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} {...rest} className={cx('vui-sidebar-group', className)}>
      {label != null && <div className="vui-sidebar-group__label">{label}</div>}
      <ul className="vui-sidebar-group__list">{children}</ul>
    </div>
  );
});

/** Тонкая линия между группами пунктов. */
export const SidebarSeparator = forwardRef<HTMLHRElement, HTMLAttributes<HTMLHRElement>>(
  function SidebarSeparator({ className, ...rest }, ref) {
    return <hr ref={ref} {...rest} className={cx('vui-sidebar-separator', className)} />;
  },
);
