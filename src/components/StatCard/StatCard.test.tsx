import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StatCard } from './StatCard';
import { StatRow } from './StatRow';

describe('StatCard', () => {
  it('renders every slot in its place', () => {
    const { container } = render(
      <StatCard
        featured
        label="Next lesson"
        tag="tomorrow"
        caption="Saturday"
        title="October 31"
        value="14:00"
      />,
    );
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild).toHaveClass('vui-stat', 'vui-stat--featured');
    expect(screen.getByText('Next lesson')).toHaveClass('vui-stat__label');
    expect(screen.getByText('tomorrow')).toHaveClass('vui-stat__tag');
    expect(screen.getByText('Saturday')).toHaveClass('vui-stat__caption');
    expect(screen.getByText('October 31')).toHaveClass('vui-stat__title');
    expect(screen.getByText('14:00')).toHaveClass('vui-stat__value');
  });

  it('skips the header when there is no label and tag', () => {
    const { container } = render(<StatCard value="7" />);
    expect(container.querySelector('.vui-stat__head')).toBeNull();
    expect(container.querySelector('.vui-stat__text')).toBeNull();
  });

  it('aligns compact cards to the end by default', () => {
    const { container, rerender } = render(<StatCard value="7" />);
    expect(container.firstElementChild).toHaveClass('vui-stat--end');
    rerender(<StatCard value="7" align="start" />);
    expect(container.firstElementChild).toHaveClass('vui-stat--start');
  });

  it('turns color into a tint variable', () => {
    const { container } = render(<StatCard value="7" color="red" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('vui-stat--tinted');
    expect(root.style.getPropertyValue('--vui-stat-color')).toBe('red');
  });

  it('becomes a button with onClick and a link with href', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<StatCard value="14:00" onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('vui-stat--interactive');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<StatCard value="14:00" href="/lessons" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/lessons');
  });

  it('disables a button card', () => {
    render(<StatCard value="14:00" onClick={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('StatRow', () => {
  it('passes width and gap as CSS variables', () => {
    const { container } = render(
      <StatRow itemWidth={200} gap={12}>
        <StatCard value="1" />
      </StatRow>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('vui-stat-row');
    expect(root.style.getPropertyValue('--vui-stat-row-item-width')).toBe('200px');
    expect(root.style.getPropertyValue('--vui-stat-row-gap')).toBe('12px');
    expect(root.querySelector('.vui-stat-row__items > .vui-stat')).not.toBeNull();
  });
});
