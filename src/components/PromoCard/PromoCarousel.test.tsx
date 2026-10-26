import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromoCarousel } from './PromoCarousel';

const renderCarousel = (props = {}) =>
  render(
    <PromoCarousel aria-label="Offers" {...props}>
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
    </PromoCarousel>,
  );

// jsdom не знает AnimationEvent, и React слушает событие с вендорным префиксом.
const endProgress = (container: HTMLElement) => {
  const progress = container.querySelector('.vui-carousel__progress')!;
  for (const type of ['animationend', 'webkitAnimationEnd']) {
    fireEvent(progress, new Event(type, { bubbles: true }));
  }
};

const activeDot = () =>
  screen.getAllByRole('button', { name: /of 3/ }).findIndex((dot) => dot.ariaCurrent === 'true');

describe('PromoCarousel', () => {
  it('renders a labelled region with one slide group per child', () => {
    renderCarousel();
    expect(screen.getByRole('region', { name: 'Offers' })).toHaveAttribute(
      'aria-roledescription',
      'carousel',
    );
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(3);
    expect(groups[1]).toHaveAccessibleName('2 of 3');
    expect(activeDot()).toBe(0);
  });

  it('moves with arrows and dots and wraps around', async () => {
    const onIndexChange = vi.fn();
    renderCarousel({ onIndexChange });
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(activeDot()).toBe(2);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(activeDot()).toBe(0);
    await userEvent.click(screen.getByRole('button', { name: '2 of 3' }));
    expect(activeDot()).toBe(1);
    expect(onIndexChange.mock.calls).toEqual([[2], [0], [1]]);
  });

  it('advances when the progress animation of the active dot ends', () => {
    const { container } = renderCarousel();
    act(() => {
      endProgress(container);
    });
    expect(activeDot()).toBe(1);
  });

  it('does not advance by itself with autoPlay off', () => {
    const { container } = renderCarousel({ autoPlay: false, defaultIndex: 1 });
    expect(container.firstElementChild).not.toHaveClass('vui-carousel--playing');
    act(() => {
      endProgress(container);
    });
    expect(activeDot()).toBe(1);
  });

  it('handles keyboard arrows when focus is on the controls', async () => {
    renderCarousel();
    screen.getByRole('button', { name: '1 of 3' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(activeDot()).toBe(1);
  });

  it('hides controls for a single slide', () => {
    render(
      <PromoCarousel>
        <div>Only</div>
      </PromoCarousel>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
