import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AnchorHTMLAttributes } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders an h2 by default', () => {
    render(<SectionHeader title="Collections" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Collections' })).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('respects headingAs', () => {
    render(<SectionHeader title="Collections" headingAs="h3" />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('turns the title into a link with href', () => {
    render(<SectionHeader title="Collections" href="/collections" />);
    const link = screen.getByRole('link', { name: 'Collections' });
    expect(link).toHaveAttribute('href', '/collections');
    expect(link.closest('h2')).not.toBeNull();
  });

  it('turns the title into a button with onClick', async () => {
    const onClick = vi.fn();
    render(<SectionHeader title="Collections" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Collections' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('passes linkProps to a custom link component', () => {
    function RouterLink({
      to,
      ...props
    }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
      return <a data-to={to} href={to} {...props} />;
    }
    render(<SectionHeader title="Trips" linkAs={RouterLink} linkProps={{ to: '/trips' }} />);
    expect(screen.getByRole('link', { name: 'Trips' })).toHaveAttribute('data-to', '/trips');
  });

  it('renders subtitle and action', () => {
    render(<SectionHeader title="Inbox" subtitle="Three new" action={<button>All</button>} />);
    expect(screen.getByText('Three new')).toHaveClass('vui-section-header__subtitle');
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });

  it('shows a muted count inside the heading and the link', () => {
    const { rerender } = render(
      <SectionHeader title="Notifications" count={30} animateCount={false} />,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Notifications30');
    expect(screen.getByText('30')).toHaveClass('vui-section-header__count');
    rerender(<SectionHeader title="Notifications" count={0} href="/n" animateCount={false} />);
    expect(screen.getByRole('link')).toContainElement(screen.getByText('0'));
  });

  it('applies the xs size class', () => {
    const { container } = render(<SectionHeader title="Students" count="2 of 5" size="xs" />);
    expect(container.firstChild).toHaveClass('vui-section-header--xs');
  });

  describe('count animation', () => {
    beforeEach(() => {
      vi.useFakeTimers({
        toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
      });
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    const shown = (container: HTMLElement) =>
      container.querySelector('.vui-section-header__count [aria-hidden="true"]')?.textContent;

    it('counts up from zero on mount and keeps the final value for screen readers', () => {
      const { container } = render(<SectionHeader title="Decks" count={40} />);
      expect(shown(container)).toBe('0');
      expect(container.querySelector('.vui-section-header__count-final')).toHaveTextContent('40');
      act(() => vi.advanceTimersByTime(350));
      const middle = Number(shown(container));
      expect(middle).toBeGreaterThan(0);
      expect(middle).toBeLessThan(40);
      act(() => vi.advanceTimersByTime(500));
      expect(screen.getByText('40')).toHaveClass('vui-section-header__count');
      expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    });

    it('animates from the previous value when count changes', () => {
      const { container, rerender } = render(<SectionHeader title="Decks" count={10} />);
      act(() => vi.advanceTimersByTime(800));
      rerender(<SectionHeader title="Decks" count={20} />);
      expect(shown(container)).toBe('10');
      act(() => vi.advanceTimersByTime(800));
      expect(screen.getByText('20')).toHaveClass('vui-section-header__count');
    });

    it('keeps the server-rendered value when hydrating', async () => {
      const { renderToString } = await import('react-dom/server');
      const { hydrateRoot } = await import('react-dom/client');
      const container = document.createElement('div');
      document.body.append(container);
      container.innerHTML = renderToString(<SectionHeader title="Words" count={300} />);
      const root = await act(async () =>
        hydrateRoot(container, <SectionHeader title="Words" count={300} />),
      );
      expect(container.querySelector('.vui-section-header__count')).toHaveTextContent('300');
      expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
      act(() => root.unmount());
      container.remove();
    });

    it('shows strings and non-integers as is', () => {
      render(<SectionHeader title="Students" count="2 of 5" />);
      expect(screen.getByText('2 of 5')).toHaveClass('vui-section-header__count');
      render(<SectionHeader title="Rating" count={4.5} />);
      expect(screen.getByText('4.5')).toHaveClass('vui-section-header__count');
    });

    it('jumps straight to the value when reduced motion is preferred', () => {
      const original = window.matchMedia;
      window.matchMedia = ((query: string) => ({
        matches: query.includes('reduce'),
      })) as typeof window.matchMedia;
      try {
        render(<SectionHeader title="Decks" count={7} />);
        expect(screen.getByText('7')).toHaveClass('vui-section-header__count');
      } finally {
        window.matchMedia = original;
      }
    });
  });
});
