import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders title, text and a default icon for the tone', () => {
    const { container } = render(
      <Banner tone="success" title="Saved">
        Available offline
      </Banner>,
    );
    expect(container.firstElementChild).toHaveClass('vui-banner', 'vui-banner--success');
    expect(screen.getByText('Saved')).toHaveClass('vui-banner__title');
    expect(screen.getByText('Available offline')).toHaveClass('vui-banner__text');
    expect(container.querySelector('.vui-banner__icon svg')).not.toBeNull();
  });

  it('hides the icon with icon={null}', () => {
    const { container } = render(<Banner icon={null}>Text</Banner>);
    expect(container.querySelector('.vui-banner__icon')).toBeNull();
  });

  it('shows a close button only with onClose', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Banner>Text</Banner>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(
      <Banner onClose={onClose} closeLabel="Hide">
        Text
      </Banner>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('passes role through for urgent messages', () => {
    render(
      <Banner tone="danger" role="alert">
        Payment failed
      </Banner>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
  });
});
