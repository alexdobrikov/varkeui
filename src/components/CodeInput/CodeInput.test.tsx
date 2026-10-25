import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CodeInput } from './CodeInput';

const cells = (container: HTMLElement) =>
  [...container.querySelectorAll('.vui-code__cell')].map((cell) => cell.textContent).join('|');

describe('CodeInput', () => {
  it('renders one cell per character with one-time-code autofill', () => {
    const { container } = render(<CodeInput aria-label="Code" length={4} />);
    const input = screen.getByLabelText('Code');
    expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(container.querySelectorAll('.vui-code__cell')).toHaveLength(4);
  });

  it('keeps only digits in numeric mode and fills the cells', async () => {
    const { container } = render(<CodeInput aria-label="Code" length={4} />);
    await userEvent.type(screen.getByLabelText('Code'), '1a2b3');
    expect(screen.getByLabelText('Code')).toHaveValue('123');
    expect(cells(container)).toBe('1|2|3|');
  });

  it('cleans a pasted code with spaces and calls onComplete once', () => {
    const onComplete = vi.fn();
    const onValueChange = vi.fn();
    render(<CodeInput aria-label="Code" onComplete={onComplete} onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText('Code'), { target: { value: '123 456' } });
    expect(onValueChange).toHaveBeenCalledWith('123456');
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith('123456');
  });

  it('accepts letters in text mode and masks them', () => {
    const { container } = render(<CodeInput aria-label="Code" mode="text" length={4} mask />);
    fireEvent.change(screen.getByLabelText('Code'), { target: { value: 'ab-7' } });
    expect(screen.getByLabelText('Code')).toHaveValue('ab7');
    expect(container.querySelectorAll('.vui-code__dot')).toHaveLength(3);
  });

  it('marks invalid state for screen readers', () => {
    render(<CodeInput aria-label="Code" invalid />);
    expect(screen.getByLabelText('Code')).toHaveAttribute('aria-invalid', 'true');
  });
});
