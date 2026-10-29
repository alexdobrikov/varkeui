import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
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
    const { rerender } = render(<SectionHeader title="Notifications" count={30} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Notifications30');
    expect(screen.getByText('30')).toHaveClass('vui-section-header__count');
    rerender(<SectionHeader title="Notifications" count={0} href="/n" />);
    expect(screen.getByRole('link')).toContainElement(screen.getByText('0'));
  });
});
