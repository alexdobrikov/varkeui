import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { Button, type ButtonProps } from '../Button/Button';

/** Текст на своём `color`: фирменные цвета кнопок обычно насыщенные, белый на них читается. */
const DEFAULT_TEXT = '#ffffff';

interface ShineButtonOwnProps {
  /** Цвет кнопки. Наведение чуть светлее. Без него — цвет варианта `variant`. */
  color?: string;
  /**
   * Цвет текста и иконок. С `color` по умолчанию белый — для светлого `color` передайте тёмный.
   * Без `color` — цвет текста варианта.
   */
  textColor?: string;
  /**
   * Цвет блика — полосы света, которая раз в несколько секунд проходит по кнопке.
   * @default rgb(255 255 255 / 0.8)
   */
  shineColor?: string;
}

export type ShineButtonProps<C extends ElementType = 'button'> = ButtonProps<C> &
  ShineButtonOwnProps;

const ShineButtonBase = forwardRef(function ShineButton(
  { color, textColor, shineColor, className, style, ...rest }: ShineButtonProps<ElementType>,
  ref: Ref<Element>,
) {
  const vars = {
    ...(color && {
      '--vui-button-bg': color,
      '--vui-button-bg-hover': `color-mix(in srgb, ${color} 88%, white)`,
    }),
    ...((textColor ?? color) && { '--vui-button-color': textColor ?? DEFAULT_TEXT }),
    ...(shineColor && { '--vui-shine-button-shine': shineColor }),
  } as CSSProperties;

  return (
    <Button
      ref={ref}
      {...rest}
      className={cx('vui-shine-button', className)}
      style={{ ...vars, ...style }}
    />
  );
});

/**
 * Кнопка с бликом, как у главных кнопок Telegram: полоса света периодически проходит
 * по кнопке и притягивает взгляд. Те же пропсы, что у `Button`, плюс цвета кнопки и блика.
 */
export const ShineButton = ShineButtonBase as <C extends ElementType = 'button'>(
  props: ShineButtonProps<C> & { ref?: Ref<Element> },
) => ReactElement | null;
