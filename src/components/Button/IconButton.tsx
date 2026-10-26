import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { buttonClassName, type ButtonSize, type ButtonVariant } from './Button';
import { Spinner } from './Spinner';

interface IconButtonOwnProps {
  /** Иконка. */
  icon: ReactNode;
  /** Подпись для скринридеров — обязательна, потому что текста на кнопке нет. */
  'aria-label': string;
  /**
   * Те же варианты, что у `Button`.
   * @default secondary
   */
  variant?: ButtonVariant;
  /**
   * Сторона квадрата: 40, 48 или 56 px.
   * @default md
   */
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** Компонент для корня, например `Link` из роутера. */
  as?: ElementType;
  /** Если передан, кнопка рендерится ссылкой `<a>`. */
  href?: string;
  target?: string;
  rel?: string;
}

export type IconButtonProps<C extends ElementType = 'button'> = IconButtonOwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof IconButtonOwnProps | 'children'>;

const IconButtonBase = forwardRef(function IconButton(
  {
    icon,
    variant = 'secondary',
    size = 'md',
    loading,
    disabled,
    as,
    className,
    ...rest
  }: IconButtonProps<'button'>,
  ref: Ref<Element>,
) {
  const Component = (as ?? (rest.href !== undefined ? 'a' : 'button')) as ElementType;
  const inactive = disabled || loading;

  const stateProps =
    Component === 'button'
      ? { type: 'button', disabled: inactive }
      : inactive
        ? { 'aria-disabled': true, tabIndex: -1 }
        : {};

  return (
    <Component
      ref={ref}
      {...stateProps}
      {...rest}
      aria-busy={loading || undefined}
      className={cx(buttonClassName({ variant, size, loading, iconOnly: true }), className)}
    >
      <span className="vui-button__content">
        <span className="vui-button__icon">{icon}</span>
      </span>
      {loading && <Spinner className="vui-button__spinner" />}
    </Component>
  );
});

export const IconButton = IconButtonBase as <C extends ElementType = 'button'>(
  props: IconButtonProps<C> & { ref?: Ref<Element> },
) => ReactElement | null;
