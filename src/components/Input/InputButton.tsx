import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface InputButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` — контрастная кнопка, `ghost` — без фона, для иконок. */
  variant?: 'primary' | 'ghost';
}

export const InputButton = forwardRef<HTMLButtonElement, InputButtonProps>(function InputButton(
  { variant = 'primary', className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      className={cx('vui-input-button', `vui-input-button--${variant}`, className)}
    />
  );
});
