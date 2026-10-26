import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromoCard } from './PromoCard';

describe('PromoCard', () => {
  it('renders title, description, image and action', () => {
    const { container } = render(
      <PromoCard
        title="Reach more readers"
        description="Boost your posts"
        image="/rocket.svg"
        action={<button type="button">Try it</button>}
      />,
    );
    expect(container.firstElementChild).toHaveClass(
      'vui-promo',
      'vui-promo--dark',
      'vui-promo--md',
      'vui-promo--with-image',
    );
    expect(screen.getByText('Reach more readers')).toHaveClass('vui-promo__title');
    expect(screen.getByText('Boost your posts')).toHaveClass('vui-promo__description');
    expect(container.querySelector('.vui-promo__image img')).toHaveAttribute('src', '/rocket.svg');
    expect(screen.getByRole('button', { name: 'Try it' }).parentElement).toHaveClass(
      'vui-promo__action',
    );
  });

  it('scopes the theme to the tone so nested controls get contrasting colors', () => {
    const { container, rerender } = render(<PromoCard title="A" />);
    expect(container.firstElementChild).toHaveAttribute('data-vui-theme', 'dark');
    rerender(<PromoCard title="A" tone="light" />);
    expect(container.firstElementChild).toHaveAttribute('data-vui-theme', 'light');
    rerender(<PromoCard title="A" tone="neutral" />);
    expect(container.firstElementChild).not.toHaveAttribute('data-vui-theme');
  });

  it('shows a close button only with onClose', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<PromoCard title="A" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<PromoCard title="A" onClose={onClose} closeLabel="Hide" />);
    await userEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('turns imageBleed and background into CSS variables', () => {
    const { container, rerender } = render(
      <PromoCard image="/a.svg" imageBleed background="red" imageSize={120} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('vui-promo--bleed');
    expect(root.style.getPropertyValue('--vui-promo-image-bleed')).toBe('24px');
    expect(root.style.getPropertyValue('--vui-promo-bg')).toBe('red');
    expect(root.style.getPropertyValue('--vui-promo-image-size')).toBe('120px');
    rerender(<PromoCard image="/a.svg" imageBleed={40} />);
    expect(root.style.getPropertyValue('--vui-promo-image-bleed')).toBe('40px');
    rerender(<PromoCard image="/a.svg" />);
    expect(root).not.toHaveClass('vui-promo--bleed');
  });
});
