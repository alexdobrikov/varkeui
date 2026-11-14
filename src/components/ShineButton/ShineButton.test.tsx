import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ShineButton } from './ShineButton';

describe('ShineButton', () => {
  it('is a Button with the shine class', () => {
    render(<ShineButton size="sm">Войти</ShineButton>);
    const button = screen.getByRole('button', { name: 'Войти' });
    expect(button).toHaveClass('vui-button', 'vui-button--sm', 'vui-shine-button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('passes colors as CSS variables', () => {
    render(
      <ShineButton color="#e8b04a" textColor="#1c1b20" shineColor="rgb(255 255 255 / 0.6)">
        Войти
      </ShineButton>,
    );
    const { style } = screen.getByRole('button');
    expect(style.getPropertyValue('--vui-button-bg')).toBe('#e8b04a');
    expect(style.getPropertyValue('--vui-button-bg-hover')).toBe(
      'color-mix(in srgb, #e8b04a 88%, white)',
    );
    expect(style.getPropertyValue('--vui-button-color')).toBe('#1c1b20');
    expect(style.getPropertyValue('--vui-shine-button-shine')).toBe('rgb(255 255 255 / 0.6)');
  });

  it('makes text white on a custom color by default', () => {
    render(<ShineButton color="#2aabee">Войти</ShineButton>);
    expect(screen.getByRole('button').style.getPropertyValue('--vui-button-color')).toBe('#ffffff');
  });

  it('leaves variant colors alone without color props', () => {
    render(<ShineButton>Войти</ShineButton>);
    expect(screen.getByRole('button').style.getPropertyValue('--vui-button-bg')).toBe('');
  });

  it('keeps own className, style, ref and handlers', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <ShineButton ref={ref} className="extra" style={{ marginTop: 4 }} onClick={onClick}>
        Войти
      </ShineButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('extra', 'vui-shine-button');
    expect(button.style.marginTop).toBe('4px');
    expect(ref.current).toBe(button);
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders a link with href', () => {
    render(<ShineButton href="/login">Войти</ShineButton>);
    expect(screen.getByRole('link', { name: 'Войти' })).toHaveClass('vui-shine-button');
  });
});
