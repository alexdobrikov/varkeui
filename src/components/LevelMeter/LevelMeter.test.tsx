import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LevelMeter } from './LevelMeter';

const bars = (root: Element) => root.querySelectorAll('.vui-level-meter__bar');
const filled = (root: Element) => root.querySelectorAll('.vui-level-meter__bar--on');

describe('LevelMeter', () => {
  it('fills as many bars as the value, three by default', () => {
    const { container } = render(<LevelMeter value={1} />);
    expect(bars(container)).toHaveLength(3);
    expect(filled(container)).toHaveLength(1);
  });

  it('grows the bars from 40% to 100%', () => {
    const { container } = render(<LevelMeter value={0} max={3} />);
    expect([...bars(container)].map((bar) => (bar as HTMLElement).style.height)).toEqual([
      '40%',
      '70%',
      '100%',
    ]);
  });

  it('clamps the value to the scale', () => {
    const { container } = render(<LevelMeter value={9} max={4} />);
    expect(filled(container)).toHaveLength(4);
  });

  it('is decorative without a label', () => {
    const { container } = render(<LevelMeter value={2} />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('is an image with the label', () => {
    render(<LevelMeter value={2} label="Difficulty: intermediate" />);
    expect(screen.getByRole('img', { name: 'Difficulty: intermediate' })).toBeInTheDocument();
  });
});
