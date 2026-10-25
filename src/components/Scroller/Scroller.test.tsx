import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Scroller } from './Scroller';

function mockOverflow(
  viewport: HTMLElement,
  { scrollLeft = 0, scrollWidth = 1000, clientWidth = 400 },
) {
  Object.defineProperty(viewport, 'scrollWidth', { configurable: true, value: scrollWidth });
  Object.defineProperty(viewport, 'clientWidth', { configurable: true, value: clientWidth });
  Object.defineProperty(viewport, 'scrollLeft', {
    configurable: true,
    value: scrollLeft,
    writable: true,
  });
}

describe('Scroller', () => {
  it('wraps every child into an item inside a focusable viewport', () => {
    render(
      <Scroller aria-label="Shortcuts">
        <span>One</span>
        <span>Two</span>
      </Scroller>,
    );
    const viewport = screen.getByLabelText('Shortcuts');
    expect(viewport).toHaveClass('vui-scroller__viewport');
    expect(viewport).toHaveAttribute('tabindex', '0');
    expect(viewport.querySelectorAll('.vui-scroller__item')).toHaveLength(2);
  });

  it('shows controls only towards the side that has more content', () => {
    render(
      <Scroller aria-label="Shortcuts">
        <span>One</span>
      </Scroller>,
    );
    const viewport = screen.getByLabelText('Shortcuts');
    const root = viewport.parentElement as HTMLElement;
    const previous = root.querySelector('.vui-scroller__button--previous') as HTMLElement;
    const next = root.querySelector('.vui-scroller__button--next') as HTMLElement;

    mockOverflow(viewport, { scrollLeft: 0 });
    fireEvent.scroll(viewport);
    expect(previous).not.toBeVisible();
    expect(next).toBeVisible();
    expect(root).toHaveClass('vui-scroller--fade-end');

    mockOverflow(viewport, { scrollLeft: 600 });
    fireEvent.scroll(viewport);
    expect(previous).toBeVisible();
    expect(next).not.toBeVisible();
    expect(root).toHaveClass('vui-scroller--fade-start');
  });

  it('scrolls by most of the visible width when a control is clicked', () => {
    render(
      <Scroller aria-label="Shortcuts" nextLabel="Forward">
        <span>One</span>
      </Scroller>,
    );
    const viewport = screen.getByLabelText('Shortcuts');
    viewport.scrollBy = vi.fn();
    mockOverflow(viewport, { scrollLeft: 0, clientWidth: 500 });
    fireEvent.scroll(viewport);
    fireEvent.click(screen.getByRole('button', { name: 'Forward' }));
    expect(viewport.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: 400 }));
  });

  it('jumps to the edges with Home and End', () => {
    render(
      <Scroller aria-label="Shortcuts">
        <span>One</span>
      </Scroller>,
    );
    const viewport = screen.getByLabelText('Shortcuts');
    viewport.scrollTo = vi.fn() as never;
    mockOverflow(viewport, { scrollWidth: 1000 });
    fireEvent.keyDown(viewport, { key: 'End' });
    expect(viewport.scrollTo).toHaveBeenLastCalledWith({ left: 1000 });
    fireEvent.keyDown(viewport, { key: 'Home' });
    expect(viewport.scrollTo).toHaveBeenLastCalledWith({ left: 0 });
  });

  it('renders no controls with controls="never"', () => {
    render(
      <Scroller aria-label="Shortcuts" controls="never">
        <span>One</span>
      </Scroller>,
    );
    expect(screen.queryAllByRole('button', { hidden: true })).toHaveLength(0);
  });

  it('maps gap and inset to CSS variables', () => {
    render(
      <Scroller aria-label="Shortcuts" gap={12} inset="1.5rem">
        <span>One</span>
      </Scroller>,
    );
    const root = screen.getByLabelText('Shortcuts').parentElement as HTMLElement;
    expect(root.style.getPropertyValue('--vui-scroller-gap')).toBe('12px');
    expect(root.style.getPropertyValue('--vui-scroller-inset')).toBe('1.5rem');
  });
});
