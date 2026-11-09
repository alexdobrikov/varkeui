import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { StatusScreen } from './StatusScreen';

describe('StatusScreen', () => {
  it('renders an h2 title inside a section by default', () => {
    const { container } = render(<StatusScreen title="Page not found" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Page not found' })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      'vui-status-screen',
      'vui-status-screen--start',
      'vui-status-screen--actions-stack',
    );
    expect(container.querySelector('.vui-status-screen__description')).toBeNull();
    expect(container.querySelector('.vui-status-screen__actions')).toBeNull();
  });

  it('respects headingAs', () => {
    render(<StatusScreen title="Page not found" headingAs="h1" />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders description, eyebrow and actions', () => {
    render(
      <StatusScreen
        title="No access"
        description="Sign in to continue"
        eyebrow={<span>Error 401</span>}
        actions={<button>Sign in</button>}
      />,
    );
    expect(screen.getByText('Sign in to continue')).toHaveClass('vui-status-screen__description');
    expect(screen.getByText('Error 401').parentElement).toHaveClass('vui-status-screen__eyebrow');
    expect(screen.getByRole('button', { name: 'Sign in' }).parentElement).toHaveClass(
      'vui-status-screen__actions',
    );
  });

  it('hides the decorative icon from assistive technology', () => {
    render(<StatusScreen title="Empty" icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies align and actionsLayout modifiers', () => {
    const { container } = render(<StatusScreen title="Done" align="center" actionsLayout="row" />);
    expect(container.firstChild).toHaveClass(
      'vui-status-screen--center',
      'vui-status-screen--actions-row',
    );
  });

  it('forwards ref and extra props', () => {
    const ref = createRef<HTMLElement>();
    render(<StatusScreen ref={ref} title="Done" id="result" className="custom" />);
    expect(ref.current).toHaveAttribute('id', 'result');
    expect(ref.current).toHaveClass('custom');
  });
});
