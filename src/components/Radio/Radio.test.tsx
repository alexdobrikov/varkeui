import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('is a labelled radiogroup with a shared name', () => {
    render(
      <RadioGroup label="Delivery" defaultValue="a">
        <Radio value="a" label="Courier" />
        <Radio value="b" label="Pickup" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Delivery' })).toBeInTheDocument();
    const [a, b] = screen.getAllByRole('radio');
    expect(a).toBeChecked();
    expect(a.getAttribute('name')).toBe(b.getAttribute('name'));
  });

  it('switches selection in uncontrolled mode', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Delivery" defaultValue="a" onValueChange={onValueChange}>
        <Radio value="a" label="Courier" />
        <Radio value="b" label="Pickup" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByText('Pickup'));
    expect(screen.getByRole('radio', { name: 'Pickup' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Courier' })).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('follows the value in controlled mode', async () => {
    const { rerender } = render(
      <RadioGroup aria-label="Plan" value="month" onValueChange={() => {}}>
        <Radio value="month" label="Monthly" />
        <Radio value="year" label="Yearly" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByText('Yearly'));
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeChecked();
    rerender(
      <RadioGroup aria-label="Plan" value="year" onValueChange={() => {}}>
        <Radio value="month" label="Monthly" />
        <Radio value="year" label="Yearly" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Yearly' })).toBeChecked();
  });

  it('disables every radio when the group is disabled', () => {
    render(
      <RadioGroup aria-label="Delivery" disabled>
        <Radio value="a" label="Courier" />
        <Radio value="b" label="Pickup" />
      </RadioGroup>,
    );
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });

  it('works on its own outside a group', () => {
    render(<Radio value="x" name="solo" label="Solo" defaultChecked />);
    expect(screen.getByRole('radio', { name: 'Solo' })).toBeChecked();
  });
});
