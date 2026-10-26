import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonOwnProps {
  /**
   * `primary` — главное действие, `secondary` — второстепенное, `outline` — с обводкой,
   * `ghost` — без фона, `danger` — удаление и другие опасные действия.
   * @default primary
   */
  variant?: ButtonVariant;
  /**
   * Высота: 40, 48 или 56 px.
   * @default md
   */
  size?: ButtonSize;
  /** Иконка перед текстом. */
  startIcon?: ReactNode;
  /** Иконка после текста. */
  endIcon?: ReactNode;
  /** Показать спиннер и заблокировать кнопку. Ширина кнопки не меняется. */
  loading?: boolean;
  /** Растянуть на ширину контейнера. */
  block?: boolean;
  disabled?: boolean;
  /** Компонент для корня, например `Link` из роутера. */
  as?: ElementType;
  children?: ReactNode;
  /** Если передан, кнопка рендерится ссылкой `<a>`. */
  href?: string;
  target?: string;
  rel?: string;
}

export type ButtonProps<C extends ElementType = 'button'> = ButtonOwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps>;

export interface ButtonClassOptions {
  variant: ButtonVariant;
  size: ButtonSize;
  block?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
}

export const buttonClassName = ({ variant, size, block, loading, iconOnly }: ButtonClassOptions) =>
  cx(
    'vui-button',
    `vui-button--${variant}`,
    `vui-button--${size}`,
    block && 'vui-button--block',
    loading && 'vui-button--loading',
    iconOnly && 'vui-button--icon-only',
  );

const ButtonBase = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    startIcon,
    endIcon,
    loading,
    block,
    disabled,
    as,
    className,
    children,
    ...rest
  }: ButtonProps<ElementType>,
  ref: Ref<Element>,
) {
  const Component: ElementType = as ?? (rest.href !== undefined ? 'a' : 'button');
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
      className={cx(buttonClassName({ variant, size, block, loading }), className)}
    >
      <span className="vui-button__content">
        {startIcon != null && <span className="vui-button__icon">{startIcon}</span>}
        {children != null && <span className="vui-button__label">{children}</span>}
        {endIcon != null && <span className="vui-button__icon">{endIcon}</span>}
      </span>
      {loading && <Spinner className="vui-button__spinner" />}
    </Component>
  );
});

export const Button = ButtonBase as <C extends ElementType = 'button'>(
  props: ButtonProps<C> & { ref?: Ref<Element> },
) => ReactElement | null;
