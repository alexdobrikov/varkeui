import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PlusIcon } from '../../icons';
import { TileButton } from './TileButton';

describe('TileButton', () => {
  it('renders a button with the label as its accessible name', () => {
    render(<TileButton label="Credit" image="/credit.png" />);
    const button = screen.getByRole('button', { name: 'Credit' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('vui-tile', 'vui-tile--lg', 'vui-tile--filled');
  });

  it('renders an image from a string source', () => {
    render(<TileButton label="Credit" image="/credit.png" imageAlt="Flamingo" />);
    expect(screen.getByRole('img', { name: 'Flamingo' })).toHaveAttribute('src', '/credit.png');
  });

  it('renders a custom node as the image', () => {
    render(<TileButton label="Add" image={<span data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<TileButton label="Credit" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<TileButton label="Credit" disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a link when href is passed', () => {
    render(<TileButton label="Home" href="/home" />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home');
  });

  it('marks a disabled link as aria-disabled and removes it from tab order', () => {
    render(<TileButton label="Home" href="/home" disabled />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });

  it('applies variant, size and block classes', () => {
    render(<TileButton label="Passport" variant="outlined" size="sm" block />);
    expect(screen.getByRole('button')).toHaveClass(
      'vui-tile--outlined',
      'vui-tile--sm',
      'vui-tile--block',
    );
  });

  it('maps layout props to CSS variables', () => {
    render(
      <TileButton
        label="Home"
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
    render(<TileButton label="Passport" badge={<PlusIcon data-testid="plus" />} />);
    expect(screen.getByTestId('plus').parentElement).toHaveClass('vui-tile__badge');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<TileButton ref={ref} label="Credit" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
