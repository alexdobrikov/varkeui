import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { CloseIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { IconButton } from '../Button';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  /** Открыто ли окно. Управляется снаружи. */
  open: boolean;
  /** Пользователь хочет закрыть окно: крестик, Esc или клик по фону. Закрыть — поставить `open={false}`. */
  onClose: () => void;
  title?: ReactNode;
  /** Текст под заголовком. */
  description?: ReactNode;
  /** Картинка или эмодзи над заголовком. С ней шапка выравнивается по центру. */
  icon?: ReactNode;
  /** Кнопки внизу. Встают в ряд равной ширины. */
  actions?: ReactNode;
  /**
   * Ширина: 400, 520 или 720 px.
   * @default md
   */
  size?: ModalSize;
  /**
   * Закрывать по клику на затемнённый фон.
   * @default true
   */
  closeOnBackdrop?: boolean;
  /**
   * Подпись крестика для скринридеров.
   * @default Close
   */
  closeLabel?: string;
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    description,
    icon,
    actions,
    size = 'md',
    closeOnBackdrop = true,
    closeLabel = 'Close',
    className,
    children,
    ...rest
  },
  ref,
) {
  const dialog = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialog.current as HTMLDialogElement);
  const titleId = useId();
  const descriptionId = useId();

  // Нативный <dialog> в модальном режиме: верхний слой, фокус внутри, фон недоступен.
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      // Браузер ставит фокус на первую кнопку — крестик — и он загорается рамкой.
      // Фокус на само окно: Tab всё равно поведёт по полям, а поле с autoFocus фокус оставит себе.
      if (document.activeElement?.classList.contains('vui-modal__close')) node.focus();
    }
    if (!open && node.open) node.close();
  }, [open]);

  // Esc: браузер закрыл бы окно сам — отдаём решение наружу, как и крестик.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  // Клик по самому <dialog> вне панели — это клик по фону.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialog}
      tabIndex={-1}
      aria-labelledby={title != null ? titleId : undefined}
      aria-describedby={description != null ? descriptionId : undefined}
      {...rest}
      className={cx(
        'vui-modal',
        `vui-modal--${size}`,
        icon != null && 'vui-modal--centered',
        className,
      )}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      <div className="vui-modal__panel">
        <IconButton
          aria-label={closeLabel}
          className="vui-modal__close"
          icon={<CloseIcon />}
          onClick={onClose}
          size="sm"
          variant="ghost"
        />
        {(icon != null || title != null || description != null) && (
          <header className="vui-modal__header">
            {icon != null && (
              <div className="vui-modal__icon" aria-hidden="true">
                {icon}
              </div>
            )}
            {title != null && (
              <h2 id={titleId} className="vui-modal__title">
                {title}
              </h2>
            )}
            {description != null && (
              <p id={descriptionId} className="vui-modal__description">
                {description}
              </p>
            )}
          </header>
        )}
        {children != null && <div className="vui-modal__body">{children}</div>}
        {actions != null && <footer className="vui-modal__actions">{actions}</footer>}
      </div>
    </dialog>
  );
});
