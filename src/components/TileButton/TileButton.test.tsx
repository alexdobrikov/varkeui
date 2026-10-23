import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PlusIcon } from '../../icons';
import { TileButton } from './TileButton';

describe('TileButton', () => {
  it('renders a button with the label as its accessible name', () => {
    render(<TileButton label="Music" image="/music.png" />);
    const button = screen.getByRole('button', { name: 'Music' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('vui-tile', 'vui-tile--lg', 'vui-tile--filled');
  });

  it('renders an image from a string source', () => {
    render(<TileButton label="Music" image="/music.png" imageAlt="Headphones" />);
    expect(screen.getByRole('img', { name: 'Headphones' })).toHaveAttribute('src', '/music.png');
  });

  it('renders a custom node as the image', () => {
    render(<TileButton label="New playlist" image={<span data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<TileButton label="Music" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<TileButton label="Music" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a link when href is passed', () => {
    render(<TileButton label="Mountains" href="/mountains" />);
    expect(screen.getByRole('link', { name: 'Mountains' })).toHaveAttribute('href', '/mountains');
  });

  it('marks a disabled link as aria-disabled and removes it from tab order', () => {
    render(<TileButton label="Mountains" href="/mountains" disabled />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });

  it('applies variant, size and block classes', () => {
    render(<TileButton label="Reading list" variant="outlined" size="sm" block />);
    expect(screen.getByRole('button')).toHaveClass(
      'vui-tile--outlined',
      'vui-tile--sm',
      'vui-tile--block',
    );
  });

  it('maps layout props to CSS variables', () => {
    render(
      <TileButton
        label="Mountains"
        width={352}
        aspectRatio={2.2}
        radius="40px"
        imagePosition="bottom-right"
        imageSize="80%"
        imageFit="cover"
        labelLines={1}
      />,
    );
    const button = screen.getByRole('button');
    expect(button.style.getPropertyValue('--vui-tile-width')).toBe('352px');
    expect(button.style.getPropertyValue('--vui-tile-ratio')).toBe('2.2');
    expect(button.style.getPropertyValue('--vui-tile-radius')).toBe('40px');
    expect(button.style.getPropertyValue('--vui-tile-justify')).toBe('flex-end');
    expect(button.style.getPropertyValue('--vui-tile-align')).toBe('flex-end');
    expect(button.style.getPropertyValue('--vui-tile-object-position')).toBe('right bottom');
    expect(button.style.getPropertyValue('--vui-tile-image-size')).toBe('80%');
    expect(button.style.getPropertyValue('--vui-tile-image-fit')).toBe('cover');
    expect(button).toHaveClass('vui-tile--single-line');
  });

  it('renders a badge', () => {
    render(<TileButton label="Reading list" badge={<PlusIcon data-testid="plus" />} />);
    expect(screen.getByTestId('plus').parentElement).toHaveClass('vui-tile__badge');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<TileButton ref={ref} label="Music" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
