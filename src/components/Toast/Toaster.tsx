import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, CloseIcon, ErrorIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { toast, toastStore, type ToastItem } from './store';

export interface ToasterProps {
  /**
   * Где показывать уведомления.
   * @default bottom-center
   */
  position?: 'top-center' | 'bottom-center' | 'top-right' | 'bottom-right';
  /**
   * Сколько уведомлений видно одновременно, остальные ждут очереди.
   * @default 3
   */
  max?: number;
  /**
   * Подпись крестика для скринридеров.
   * @default Close
   */
  closeLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const EXIT_MS = 200;

const subscribeNothing = () => () => {};

function ToastView({ item, closeLabel }: { item: ToastItem; closeLabel: string }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration ?? 4000);
  const startedAt = useRef(0);

  useEffect(() => {
    if (item.closing) {
      const timer = setTimeout(() => toastStore.remove(item.id), EXIT_MS);
      return () => clearTimeout(timer);
    }
    if (paused || !Number.isFinite(remaining.current)) return;
    startedAt.current = Date.now();
    const timer = setTimeout(() => toast.dismiss(item.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [item.closing, item.id, paused]);

  const icon =
    item.icon !== undefined ? (
      item.icon
    ) : item.tone === 'success' ? (
      <CheckCircleIcon />
    ) : item.tone === 'danger' ? (
      <ErrorIcon />
    ) : null;

  return (
    <div
      className={cx(
        'vui-toast',
        item.tone && `vui-toast--${item.tone}`,
        item.closing && 'vui-toast--closing',
      )}
      role={item.tone === 'danger' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {icon != null && (
        <span className="vui-toast__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="vui-toast__body">
        <div className="vui-toast__message">{item.message}</div>
        {item.description != null && (
          <div className="vui-toast__description">{item.description}</div>
        )}
      </div>
      {item.action && (
        <button
          type="button"
          className="vui-toast__action"
          onClick={() => {
            item.action?.onClick();
            toast.dismiss(item.id);
          }}
        >
          {item.action.label}
        </button>
      )}
      <button
        type="button"
        className="vui-toast__close"
        aria-label={closeLabel}
        onClick={() => toast.dismiss(item.id)}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

/** Место, где появляются уведомления из `toast()`. Поставьте один раз в корне приложения. */
export function Toaster({
  position = 'bottom-center',
  max = 3,
  closeLabel = 'Close',
  className,
  style,
}: ToasterProps) {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );
  const isClient = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  const visible = items.slice(-max);
  const ordered = position.startsWith('top') ? [...visible].reverse() : visible;

  return createPortal(
    <section
      aria-label="Notifications"
      className={cx('vui-toaster', `vui-toaster--${position}`, className)}
      style={style}
    >
      {ordered.map((item) => (
        <ToastView key={item.id} item={item} closeLabel={closeLabel} />
      ))}
    </section>,
    document.body,
  );
}
