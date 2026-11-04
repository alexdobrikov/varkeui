import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';
describe('Select', () => {
  it('uses the native picker, label, ref and form value', async () => {
    const ref = createRef<HTMLSelectElement>();
    const onChange = vi.fn();
    render(
      <form aria-label="settings">
        <Select ref={ref} label="Folder" name="folder" defaultValue="a" onChange={onChange}>
          <option value="a">A</option>
          <option value="b">B</option>
        </Select>
      </form>,
    );
    const select = screen.getByRole('combobox', { name: 'Folder' });
    expect(ref.current).toBe(select);
    await userEvent.selectOptions(select, 'b');
    expect(onChange).toHaveBeenCalledOnce();
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('folder')).toBe('b');
  });
  it('connects an error, preserving external descriptions', () => {
    render(
      <>
        <span id="external">Details</span>
        <Select label="Folder" error="Required" hint="Hint" aria-describedby="external">
          <option>A</option>
        </Select>
      </>,
    );
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Details Required');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });
  it('preserves disabled state and sizes', () => {
    const { container } = render(
      <Select label="Folder" disabled size="lg" variant="outlined">
        <option>A</option>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(container.firstElementChild).toHaveClass('vui-input--lg', 'vui-input--outlined');
  });
});
