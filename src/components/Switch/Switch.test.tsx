import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { List, ListItem } from '../List';
import { Switch } from './Switch';

describe('Switch', () => {
  it('is a checkbox with the switch role', () => {
    render(<Switch aria-label="Reminders" />);
    const control = screen.getByRole('switch', { name: 'Reminders' });
    expect(control).toHaveAttribute('type', 'checkbox');
    expect(control).not.toBeChecked();
  });

  it('toggles and reports the new value', async () => {
    const onChange = vi.fn();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Reminders" onChange={onChange} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles by clicking its label', async () => {
    render(<Switch label="Dark mode" />);
    await userEvent.click(screen.getByText('Dark mode'));
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
  });

  it('does not toggle when disabled', async () => {
    render(<Switch aria-label="Off" disabled />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('toggles from a whole list row rendered as a label', async () => {
    render(
      <List>
        <ListItem as="label" title="Backup photos" after={<Switch />} />
      </List>,
    );
    await userEvent.click(screen.getByText('Backup photos'));
    expect(screen.getByRole('switch', { name: 'Backup photos' })).toBeChecked();
  });

  it('forwards ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch ref={ref} aria-label="Ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
