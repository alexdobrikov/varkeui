import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('connects label and hint', () => {
    render(<Textarea label="Note" hint="Visible only to you" />);
    const textarea = screen.getByLabelText('Note');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAccessibleDescription('Visible only to you');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('shows the error instead of the hint', () => {
    render(<Textarea label="Note" hint="Hint" error="Too short" />);
    expect(screen.getByLabelText('Note')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('counts characters while typing', async () => {
    const onChange = vi.fn();
    render(<Textarea label="Bio" maxLength={20} showCount onChange={onChange} />);
    expect(screen.getByText('0 / 20')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Bio'), 'Hello');
    expect(screen.getByText('5 / 20')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it('counts a controlled value and forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} label="Bio" value="abc" onChange={() => {}} showCount />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
