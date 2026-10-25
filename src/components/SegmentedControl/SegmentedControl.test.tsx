import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year', disabled: true },
];

describe('SegmentedControl', () => {
  it('selects the first option by default', () => {
    render(<SegmentedControl aria-label="Period" options={options} />);
    expect(screen.getByRole('radiogroup', { name: 'Period' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('changes selection on click and reports it', async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl aria-label="Period" options={options} onValueChange={onValueChange} />,
    );
    await userEvent.click(screen.getByText('Month'));
    expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('month');
    expect(screen.getByText('Month').closest('label')).toHaveClass('vui-segmented__item--checked');
  });

  it('respects the controlled value', async () => {
    render(
      <SegmentedControl
        aria-label="Period"
        options={options}
        value="week"
        onValueChange={() => {}}
      />,
    );
    await userEvent.click(screen.getByText('Month'));
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  });

  it('disables single options and the whole control', () => {
    const { rerender } = render(<SegmentedControl aria-label="Period" options={options} />);
    expect(screen.getByRole('radio', { name: 'Year' })).toBeDisabled();
    rerender(<SegmentedControl aria-label="Period" options={options} disabled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });

  it('labels icon-only segments', () => {
    render(
      <SegmentedControl
        aria-label="View"
        options={[{ value: 'grid', icon: <svg />, 'aria-label': 'Grid' }]}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeInTheDocument();
  });
});
