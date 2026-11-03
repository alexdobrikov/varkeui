import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NumberInput } from './NumberInput';

function Controlled(props: {
  initial: number;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
}) {
  const [value, setValue] = useState(props.initial);
  return (
    <NumberInput
      label="Count"
      value={value}
      onValueChange={setValue}
      min={props.min}
      max={props.max}
      step={props.step}
      format={props.format}
    />
  );
}

describe('NumberInput', () => {
  it('steps with the buttons and stops at the bounds', async () => {
    render(<Controlled initial={2} min={2} max={4} />);
    const input = screen.getByRole('spinbutton', { name: 'Count' });
    const dec = screen.getByRole('button', { name: 'Decrease' });
    const inc = screen.getByRole('button', { name: 'Increase' });
    expect(dec).toBeDisabled();
    await userEvent.click(inc);
    await userEvent.click(inc);
    expect(input).toHaveValue('4');
    expect(inc).toBeDisabled();
    await userEvent.click(dec);
    expect(input).toHaveValue('3');
  });

  it('commits a typed number on blur, clamped and rounded to the step', async () => {
    render(<Controlled initial={1} min={0} max={10} step={0.5} />);
    const input = screen.getByRole('spinbutton');
    await userEvent.clear(input);
    await userEvent.type(input, '7,3');
    expect(input).toHaveValue('7,3');
    await userEvent.tab();
    expect(input).toHaveValue('7.5');
    await userEvent.clear(input);
    await userEvent.type(input, '99{Enter}');
    expect(input).toHaveValue('10');
  });

  it('changes by the step with arrow keys and shows the formatted value', async () => {
    render(<Controlled initial={2} format={(v) => `${v} pcs`} />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue('2 pcs');
    input.focus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowDown}');
    expect(input).toHaveValue('3 pcs');
    expect(input).toHaveAttribute('aria-valuetext', '3 pcs');
  });

  it('supports the outlined variant', () => {
    const { container } = render(
      <NumberInput aria-label="n" value={1} onValueChange={() => {}} variant="outlined" />,
    );
    expect(container.firstElementChild).toHaveClass('vui-input--outlined');
  });

  it('does not call onValueChange when the value does not change', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="n" value={4} onValueChange={onValueChange} max={4} />);
    await userEvent.type(screen.getByRole('spinbutton'), '{ArrowUp}');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
