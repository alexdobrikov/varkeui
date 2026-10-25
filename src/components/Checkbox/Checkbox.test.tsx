import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles by clicking the label and reports the value', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Digest" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText('Digest'));
    expect(screen.getByRole('checkbox', { name: 'Digest' })).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('sets the indeterminate DOM property', () => {
    const { rerender } = render(<Checkbox label="All" indeterminate />);
    expect(screen.getByRole('checkbox')).toHaveProperty('indeterminate', true);
    rerender(<Checkbox label="All" indeterminate={false} />);
    expect(screen.getByRole('checkbox')).toHaveProperty('indeterminate', false);
  });

  it('marks invalid and disabled states', async () => {
    render(<Checkbox label="Terms" invalid disabled />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(screen.getByText('Terms'));
    expect(box).not.toBeChecked();
  });

  it('includes the description in the accessible name area and forwards ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Digest" description="Once a week" />);
    expect(screen.getByText('Once a week')).toHaveClass('vui-check__description');
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
