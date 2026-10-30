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
import { useSidebar } from './SidebarProvider';

interface SidebarBrandOwnProps {
  /** Логотип: URL картинки или React-узел. Остаётся виден в свёрнутом меню. */
  logo?: ReactNode;
  /** Название. */
  title: ReactNode;
  /** Строка под названием, приглушённым цветом. */
  subtitle?: ReactNode;
  /** Компонент для корня, например `Link` из роутера. */
  as?: ElementType;
}

export type SidebarBrandProps<C extends ElementType = 'a'> = SidebarBrandOwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof SidebarBrandOwnProps>;

type LooseBrandProps = SidebarBrandOwnProps &
  Omit<AnchorHTMLAttributes<HTMLElement>, keyof SidebarBrandOwnProps>;

const SidebarBrandBase = forwardRef<Element, LooseBrandProps>(function SidebarBrand(
  { logo, title, subtitle, as, className, onClick, ...rest },
  ref,
) {
  const { setOpen } = useSidebar();
  const Component: ElementType = as ?? (rest.href !== undefined ? 'a' : 'div');
  return (
    <Component
      ref={ref}
      {...rest}
      onClick={(e: MouseEvent<HTMLElement>) => {
        onClick?.(e);
        setOpen(false);
      }}
      className={cx('vui-sidebar-brand', className)}
    >
      {logo != null && (
        <span className="vui-sidebar-brand__logo">
          {typeof logo === 'string' ? <img src={logo} alt="" draggable={false} /> : logo}
        </span>
      )}
      <span className="vui-sidebar-brand__text">
        <span className="vui-sidebar-brand__title">{title}</span>
        {subtitle != null && <span className="vui-sidebar-brand__subtitle">{subtitle}</span>}
      </span>
    </Component>
  );
});

/** Логотип и название в шапке меню. */
export const SidebarBrand = SidebarBrandBase as <C extends ElementType = 'a'>(
  props: SidebarBrandProps<C> & { ref?: Ref<Element> },
) => ReactElement | null;

const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const PanelIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="4" />
    <path d="M9 4v16" />
    <path d={collapsed ? 'M14 10l2 2-2 2' : 'M16 10l-2 2 2 2'} />
  </svg>
);

export interface SidebarTriggerProps extends ComponentPropsWithoutRef<'button'> {
  /** Своя иконка вместо «бургера». */
  icon?: ReactNode;
}

/** Кнопка-«бургер», открывает меню на телефоне. На компьютере скрыта. */
export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  function SidebarTrigger({ icon, className, onClick, ...rest }, ref) {
    const { open, toggleOpen } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        {...rest}
        onClick={(e) => {
          onClick?.(e);
          toggleOpen();
        }}
        className={cx('vui-sidebar-icon-button', 'vui-sidebar-trigger', className)}
      >
        {icon ?? <MenuIcon />}
      </button>
    );
  },
);

/** Кнопка «свернуть / развернуть» меню до иконок. На телефоне скрыта. */
export const SidebarCollapseButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<'button'>
>(function SidebarCollapseButton({ className, onClick, ...rest }, ref) {
  const { collapsed, toggleCollapsed } = useSidebar();
  const label = collapsed ? 'Развернуть меню' : 'Свернуть меню';
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      aria-expanded={!collapsed}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        toggleCollapsed();
      }}
      className={cx('vui-sidebar-icon-button', 'vui-sidebar-collapse', className)}
    >
      <PanelIcon collapsed={collapsed} />
    </button>
  );
});
