import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders text with tone and size classes', () => {
    render(
      <Badge tone="success" size="sm">
        New
      </Badge>,
    );
    expect(screen.getByText('New')).toHaveClass('vui-badge', 'vui-badge--success', 'vui-badge--sm');
  });

  it('shows a count and caps it at max', () => {
    const { rerender } = render(<Badge count={7} />);
    expect(screen.getByText('7')).toBeInTheDocument();
    rerender(<Badge count={120} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
    rerender(<Badge count={1200} max={999} />);
    expect(screen.getByText('999+')).toBeInTheDocument();
  });

  it('hides a zero count unless showZero is set', () => {
    const { container, rerender } = render(<Badge count={0} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Badge count={0} showZero />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders a dot without content', () => {
    render(<Badge dot tone="danger" aria-label="Unread" />);
    const dot = screen.getByLabelText('Unread');
    expect(dot).toHaveClass('vui-badge--dot');
    expect(dot).toBeEmptyDOMElement();
  });
});
