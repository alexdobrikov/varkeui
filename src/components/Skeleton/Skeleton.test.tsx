import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technology and animated by default', () => {
    const { container } = render(<Skeleton width={120} height={40} radius={8} />);
    const node = container.firstElementChild as HTMLElement;
    expect(node).toHaveAttribute('aria-hidden', 'true');
    expect(node).toHaveClass('vui-skeleton--rect', 'vui-skeleton--animated');
    expect(node.style.getPropertyValue('--vui-skeleton-width')).toBe('120px');
    expect(node.style.getPropertyValue('--vui-skeleton-height')).toBe('40px');
    expect(node.style.getPropertyValue('--vui-skeleton-radius')).toBe('8px');
  });

  it('renders several text lines with a shorter last one', () => {
    const { container } = render(<Skeleton variant="text" lines={3} animated={false} />);
    const lines = container.querySelectorAll('.vui-skeleton--text');
    expect(lines).toHaveLength(3);
    expect(lines[2]).toHaveClass('vui-skeleton--last-line');
    expect(lines[0]).not.toHaveClass('vui-skeleton--animated');
  });

  it('supports circles', () => {
    const { container } = render(<Skeleton variant="circle" width={48} />);
    expect(container.firstElementChild).toHaveClass('vui-skeleton--circle');
  });
});
