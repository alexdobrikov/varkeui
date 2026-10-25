import type { ReactNode } from 'react';

export type ToastTone = 'neutral' | 'success' | 'danger';

export interface ToastOptions {
  /** Пояснение под основным текстом. */
  description?: ReactNode;
  /**
   * Иконка слева: у `success` и `danger` есть своя, `null` убирает.
   */
  tone?: ToastTone;
  icon?: ReactNode;
  /** Кнопка в уведомлении, например «Отменить». */
  action?: { label: ReactNode; onClick: () => void };
  /**
   * Сколько миллисекунд показывать. `Infinity` — пока не закроют.
   * @default 4000
   */
  duration?: number;
  /** Свой id — повторный вызов с тем же id обновит уведомление, а не добавит новое. */
  id?: string;
}

export interface ToastItem extends ToastOptions {
  id: string;
  message: ReactNode;
  closing: boolean;
}

type Listener = () => void;

let items: ToastItem[] = [];
const listeners = new Set<Listener>();
let counter = 0;

const emit = () => {
  for (const listener of listeners) listener();
};

const empty: ToastItem[] = [];

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => items,
  getServerSnapshot: () => empty,
  remove(id: string) {
    items = items.filter((item) => item.id !== id);
    emit();
  },
};

const show = (message: ReactNode, options: ToastOptions = {}) => {
  const id = options.id ?? `vui-toast-${++counter}`;
  const next: ToastItem = { ...options, id, message, closing: false };
  const existing = items.findIndex((item) => item.id === id);
  items = existing === -1 ? [...items, next] : items.map((item) => (item.id === id ? next : item));
  emit();
  return id;
};

/** Показать уведомление. Возвращает id, по которому его можно закрыть. */
export const toast = Object.assign(show, {
  success: (message: ReactNode, options?: ToastOptions) =>
    show(message, { ...options, tone: 'success' }),
  error: (message: ReactNode, options?: ToastOptions) =>
    show(message, { ...options, tone: 'danger' }),
  /** Закрыть одно уведомление или все, если id не передан. */
  dismiss: (id?: string) => {
    items = items.map((item) =>
      id === undefined || item.id === id ? { ...item, closing: true } : item,
    );
    emit();
  },
});
