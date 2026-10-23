import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';
import { InputButton } from './InputButton';

describe('Input', () => {
  it('connects the label to the input', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveClass('vui-input__control');
  });

  it('passes native props to the input and forwards ref', async () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(<Input ref={ref} placeholder="Search" type="search" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Search');
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('type', 'search');
    await userEvent.type(input, 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('describes the input with the hint', () => {
    render(<Input label="Name" hint="As in your passport" />);
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('As in your passport');
  });

  it('shows the error instead of the hint and marks the input invalid', () => {
    const { container } = render(<Input label="Name" hint="Hint" error="Required" />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Required');
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('vui-input--invalid');
  });

  it('renders icons and an action', async () => {
    const onClick = vi.fn();
    render(
      <Input
        startIcon={<span data-testid="start" />}
        endIcon={<span data-testid="end" />}
        action={<InputButton onClick={onClick}>Apply</InputButton>}
      />,
    );
    expect(screen.getByTestId('start').parentElement).toHaveClass('vui-input__icon');
    expect(screen.getByTestId('end').parentElement).toHaveClass('vui-input__icon');
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('focuses the input when clicking the field around it', async () => {
    render(<Input startIcon={<span data-testid="start" />} />);
    await userEvent.click(screen.getByTestId('start'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('keeps focus on the action button when it is clicked', async () => {
    render(<Input action={<InputButton>Go</InputButton>} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(screen.getByRole('textbox')).not.toHaveFocus();
  });

  it('applies size, variant, block and disabled', () => {
    const { container } = render(<Input size="lg" variant="outlined" block disabled />);
    expect(container.firstElementChild).toHaveClass(
      'vui-input--lg',
      'vui-input--outlined',
      'vui-input--block',
      'vui-input--disabled',
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});

describe('InputButton', () => {
  it('is a non-submitting button by default', () => {
    render(<InputButton variant="ghost" aria-label="Show password" />);
    const button = screen.getByRole('button', { name: 'Show password' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('vui-input-button--ghost');
  });
});
