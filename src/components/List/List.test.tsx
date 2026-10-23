import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { List } from './List';
import { ListItem } from './ListItem';

describe('ListItem', () => {
  it('renders title, subtitle and icon', () => {
    render(
      <ListItem
        title="Protect your data"
        subtitle="Turn on face login"
        icon="/shield.png"
        iconAlt="Shield"
      />,
    );
    expect(screen.getByText('Protect your data')).toHaveClass('vui-list-item__title');
    expect(screen.getByText('Turn on face login')).toHaveClass('vui-list-item__subtitle');
    expect(screen.getByRole('img', { name: 'Shield' })).toHaveAttribute('src', '/shield.png');
  });

  it('is a plain block without onClick or href', () => {
    const { container } = render(<ListItem title="Static" />);
    expect(container.firstElementChild?.tagName).toBe('DIV');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('becomes a button with onClick', async () => {
    const onClick = vi.fn();
    render(<ListItem title="Add family members" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Add family members' });
    expect(button).toHaveClass('vui-list-item--interactive');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('becomes a link with href', () => {
    render(<ListItem title="Settings" href="/settings" />);
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');
  });

  it('disables a link', () => {
    render(<ListItem title="Settings" href="/settings" disabled />);
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders the after slot', () => {
    render(<ListItem title="Settings" after={<span data-testid="chevron" />} />);
    expect(screen.getByTestId('chevron').parentElement).toHaveClass('vui-list-item__after');
  });

  it('maps props to classes and CSS variables', () => {
    const { container } = render(
      <ListItem
        title="Item"
        size="lg"
        align="start"
        iconSize={64}
        titleLines={1}
        subtitleLines={2}
      />,
    );
    const item = container.firstElementChild as HTMLElement;
    expect(item).toHaveClass('vui-list-item--lg', 'vui-list-item--align-start');
    expect(item.style.getPropertyValue('--vui-list-item-icon-size')).toBe('64px');
    expect(item.style.getPropertyValue('--vui-list-item-title-lines')).toBe('1');
    expect(item.style.getPropertyValue('--vui-list-item-subtitle-lines')).toBe('2');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>();
    render(<ListItem ref={ref} title="Item" onClick={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('List', () => {
  it('wraps every item in a list row', () => {
    render(
      <List dividers>
        <ListItem title="One" />
        <ListItem title="Two" />
      </List>,
    );
    const list = screen.getByRole('list');
    expect(list).toHaveClass('vui-list', 'vui-list--dividers');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
