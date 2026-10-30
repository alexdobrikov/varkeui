import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';

/** Ширина окна, с которой меню перестаёт быть выезжающей панелью. Совпадает с `@media` в CSS. */
const DESKTOP_QUERY = '(min-width: 768px)';

export interface SidebarContextValue {
  /** Меню свёрнуто до колонки иконок (компьютер). */
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
  /** Выезжающая панель открыта (телефон). */
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Состояние меню для своих кнопок и пунктов. Работает внутри `SidebarProvider`. */
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar должен вызываться внутри <SidebarProvider>');
  return ctx;
}

/** То же, что `useSidebar`, но без ошибки вне провайдера — для пунктов, которые могут жить и отдельно. */
export function useOptionalSidebar(): SidebarContextValue | null {
  return useContext(SidebarContext);
}

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** Свёрнуто ли меню до иконок — управляемый режим. */
  collapsed?: boolean;
  /**
   * Начальное состояние для неуправляемого режима.
   * @default false
   */
  defaultCollapsed?: boolean;
  /** Вызывается при сворачивании и разворачивании. Удобно, чтобы запомнить выбор в localStorage. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Открыта ли панель на телефоне — управляемый режим. */
  open?: boolean;
  /** Вызывается при открытии и закрытии панели на телефоне. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Обёртка раскладки «меню + контент». Хранит состояние меню и раскладывает
 * `Sidebar` и `SidebarMain` в ряд.
 */
export const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
  function SidebarProvider(
    {
      collapsed: collapsedProp,
      defaultCollapsed = false,
      onCollapsedChange,
      open: openProp,
      onOpenChange,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
    const [openState, setOpenState] = useState(false);
    const collapsed = collapsedProp ?? collapsedState;
    const open = openProp ?? openState;

    const setCollapsed = useCallback(
      (next: boolean) => {
        if (collapsedProp === undefined) setCollapsedState(next);
        onCollapsedChange?.(next);
      },
      [collapsedProp, onCollapsedChange],
    );
    const setOpen = useCallback(
      (next: boolean) => {
        if (openProp === undefined) setOpenState(next);
        onOpenChange?.(next);
      },
      [openProp, onOpenChange],
    );

    // Панель на телефоне: Escape закрывает, страница под ней не прокручивается.
    // Если окно растянули до компьютерной ширины — панель закрывается сама.
    useEffect(() => {
      if (!open) return;
      // matchMedia может не быть в тестовом окружении — тогда считаем окно телефонным.
      const desktop =
        typeof window.matchMedia === 'function' ? window.matchMedia(DESKTOP_QUERY) : null;
      if (desktop?.matches) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      const onResize = () => {
        if (desktop?.matches) setOpen(false);
      };
      const overflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
      desktop?.addEventListener('change', onResize);
      return () => {
        document.body.style.overflow = overflow;
        document.removeEventListener('keydown', onKey);
        desktop?.removeEventListener('change', onResize);
      };
    }, [open, setOpen]);

    const value = useMemo<SidebarContextValue>(
      () => ({
        collapsed,
        setCollapsed,
        toggleCollapsed: () => setCollapsed(!collapsed),
        open,
        setOpen,
        toggleOpen: () => setOpen(!open),
      }),
      [collapsed, setCollapsed, open, setOpen],
    );

    return (
      <SidebarContext.Provider value={value}>
        <div ref={ref} {...rest} className={cx('vui-sidebar-layout', className)}>
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
