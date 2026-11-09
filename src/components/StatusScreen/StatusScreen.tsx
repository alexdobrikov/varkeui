import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface StatusScreenProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  /** Текст под заголовком: что случилось и что можно сделать. */
  description?: ReactNode;
  /** Строка над заголовком: `Badge` с кодом ошибки, статус, метка раздела. */
  eyebrow?: ReactNode;
  /** Иллюстрация или крупная иконка над всем блоком. */
  icon?: ReactNode;
  /** Кнопки под текстом. Первой ставьте главную. */
  actions?: ReactNode;
  /**
   * Тег заголовка. Если экран занимает всю страницу (404, нет доступа) — `h1`.
   * @default h2
   */
  headingAs?: 'h1' | 'h2' | 'h3';
  /**
   * Выравнивание текста и кнопок.
   * @default start
   */
  align?: 'start' | 'center';
  /**
   * Кнопки столбиком во всю ширину или в строку.
   * @default stack
   */
  actionsLayout?: 'stack' | 'row';
}

/** Экран состояния: ошибка, нет доступа, пустой раздел, результат действия. */
export const StatusScreen = forwardRef<HTMLElement, StatusScreenProps>(function StatusScreen(
  {
    title,
    description,
    eyebrow,
    icon,
    actions,
    headingAs: Heading = 'h2',
    align = 'start',
    actionsLayout = 'stack',
    className,
    ...rest
  },
  ref,
) {
  return (
    <section
      ref={ref}
      {...rest}
      className={cx(
        'vui-status-screen',
        `vui-status-screen--${align}`,
        `vui-status-screen--actions-${actionsLayout}`,
        className,
      )}
    >
      {icon != null && (
        <div className="vui-status-screen__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      {eyebrow != null && <div className="vui-status-screen__eyebrow">{eyebrow}</div>}
      <div className="vui-status-screen__text">
        <Heading className="vui-status-screen__title">{title}</Heading>
        {description != null && <p className="vui-status-screen__description">{description}</p>}
      </div>
      {actions != null && <div className="vui-status-screen__actions">{actions}</div>}
    </section>
  );
});
