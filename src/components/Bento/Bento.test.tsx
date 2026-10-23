import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BentoCard } from './BentoCard';
import { BentoGrid } from './BentoGrid';

describe('BentoGrid', () => {
  it('maps plain values to CSS variables', () => {
    const { container } = render(<BentoGrid columns={6} rowHeight={220} gap={12} dense />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--vui-bento-columns')).toBe('6');
    expect(root.style.getPropertyValue('--vui-bento-row-height')).toBe('220px');
    expect(root.style.getPropertyValue('--vui-bento-gap')).toBe('12px');
    expect(root.firstElementChild).toHaveClass('vui-bento__grid--dense');
  });

  it('maps responsive values to per-breakpoint variables', () => {
    const { container } = render(
      <BentoGrid columns={{ base: 2, md: 6 }} rowHeight={{ base: 180, lg: '15rem' }} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--vui-bento-columns')).toBe('2');
    expect(root.style.getPropertyValue('--vui-bento-columns-md')).toBe('6');
    expect(root.style.getPropertyValue('--vui-bento-columns-sm')).toBe('');
    expect(root.style.getPropertyValue('--vui-bento-row-height')).toBe('180px');
    expect(root.style.getPropertyValue('--vui-bento-row-height-lg')).toBe('15rem');
  });
});

describe('BentoCard', () => {
  it('is a plain block without href or onClick', () => {
    const { container } = render(<BentoCard title="Notes" />);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(container.firstElementChild).not.toHaveClass('vui-bento-card--interactive');
  });

  it('is a link with href', () => {
    render(<BentoCard href="/music" title="Music" image="/music.png" imageAlt="Headphones" />);
    const link = screen.getByRole('link', { name: /Music/ });
    expect(link).toHaveAttribute('href', '/music');
    expect(link).toHaveClass('vui-bento-card--interactive');
    expect(screen.getByRole('img', { name: 'Headphones' })).toHaveAttribute('src', '/music.png');
  });

  it('is a button with onClick', async () => {
    const onClick = vi.fn();
    render(<BentoCard title="Photo walks" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Photo walks' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders a custom component with its own props', () => {
    function RouterLink({
      to,
      ...props
    }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
      return <a data-to={to} href={to} {...props} />;
    }
    render(<BentoCard as={RouterLink} to="/plants" title="Plant care" />);
    const link = screen.getByRole('link', { name: 'Plant care' });
    expect(link).toHaveAttribute('data-to', '/plants');
    expect(link).toHaveClass('vui-bento-card', 'vui-bento-card--interactive');
  });

  it('disables a link', () => {
    render(<BentoCard href="/x" title="Soon" disabled />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });

  it('maps spans, background and image settings to CSS variables', () => {
    const { container } = render(
      <BentoCard
        title="Workouts"
        colSpan={{ base: 1, md: 3 }}
        rowSpan={2}
        background="#fff"
        imagePosition="top-left"
        imageSize="60%"
        imageFit="cover"
      />,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.style.getPropertyValue('--vui-bento-col-span')).toBe('1');
    expect(card.style.getPropertyValue('--vui-bento-col-span-md')).toBe('3');
    expect(card.style.getPropertyValue('--vui-bento-row-span')).toBe('2');
    expect(card.style.getPropertyValue('--vui-bento-card-bg')).toBe('#fff');
    expect(card.style.getPropertyValue('--vui-bento-image-position')).toBe('left top');
    expect(card.style.getPropertyValue('--vui-bento-image-size')).toBe('60%');
    expect(card.style.getPropertyValue('--vui-bento-image-fit')).toBe('cover');
  });

  it('renders description and extra children', () => {
    render(
      <BentoCard title="Reading list" description="Ten books for the summer">
        <span>Extra</span>
      </BentoCard>,
    );
    expect(screen.getByText('Ten books for the summer')).toHaveClass('vui-bento-card__description');
    expect(screen.getByText('Extra')).toBeInTheDocument();
  });
});
