import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { IconButton } from './IconButton';

describe('Button', () => {
  it('renders a non-submitting button with default classes', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('vui-button', 'vui-button--primary', 'vui-button--md');
  });

  it('keeps an explicit type', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('applies variant, size and block', () => {
    render(
      <Button variant="outline" size="lg" block>
        Wide
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass(
      'vui-button--outline',
      'vui-button--lg',
      'vui-button--block',
    );
  });

  it('renders icons around the label', () => {
    render(
      <Button startIcon={<span data-testid="start" />} endIcon={<span data-testid="end" />}>
        Go
      </Button>,
    );
    expect(screen.getByTestId('start').parentElement).toHaveClass('vui-button__icon');
    expect(screen.getByTestId('end').parentElement).toHaveClass('vui-button__icon');
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('blocks clicks while loading and keeps the label for screen readers', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a link with href', () => {
    render(<Button href="/docs">Docs</Button>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).not.toHaveAttribute('type');
  });

  it('disables a link', () => {
    render(
      <Button href="/docs" disabled>
        Docs
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });

  it('renders a custom component with its own props', () => {
    function RouterLink({
      to,
      ...props
    }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
      return <a data-to={to} href={to} {...props} />;
    }
    render(
      <Button as={RouterLink} to="/settings">
        Settings
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('data-to', '/settings');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('IconButton', () => {
  it('is a square secondary button labelled by aria-label', () => {
    render(<IconButton aria-label="Search" icon={<svg data-testid="icon" />} />);
    const button = screen.getByRole('button', { name: 'Search' });
    expect(button).toHaveClass('vui-button--secondary', 'vui-button--icon-only');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('supports loading and links', () => {
    render(
      <>
        <IconButton aria-label="Busy" icon={<svg />} loading />
        <IconButton aria-label="Open" icon={<svg />} href="/open" />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Busy' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('href', '/open');
  });
});
