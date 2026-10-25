import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { CheckCircleIcon, CloseIcon, ErrorIcon, InfoIcon, WarningIcon } from '../../icons';
import { cx } from '../../utils/cx';

export type BannerTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Смысл сообщения: от него зависят цвет и иконка.
   * @default info
   */
  tone?: BannerTone;
  title?: ReactNode;
  /** Своя иконка вместо стандартной для `tone`. `null` убирает иконку. */
  icon?: ReactNode;
  /** Кнопки или ссылка под текстом. */
  action?: ReactNode;
  /** Показать крестик. Вызывается при клике на него — скрывать баннер решаете вы. */
  onClose?: () => void;
  /**
   * Подпись крестика для скринридеров.
   * @default Close
   */
  closeLabel?: string;
}

const icons: Record<BannerTone, ReactNode> = {
  neutral: <InfoIcon />,
  info: <InfoIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
  danger: <ErrorIcon />,
};

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    tone = 'info',
    title,
    icon,
    action,
    onClose,
    closeLabel = 'Close',
    className,
    children,
    ...rest
  },
  ref,
) {
  const shownIcon = icon === undefined ? icons[tone] : icon;

  return (
    <div ref={ref} {...rest} className={cx('vui-banner', `vui-banner--${tone}`, className)}>
      {shownIcon != null && (
        <span className="vui-banner__icon" aria-hidden="true">
          {shownIcon}
        </span>
      )}
      <div className="vui-banner__body">
        {title != null && <div className="vui-banner__title">{title}</div>}
        {children != null && <div className="vui-banner__text">{children}</div>}
        {action != null && <div className="vui-banner__action">{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="vui-banner__close"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});
