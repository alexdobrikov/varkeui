import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('is static text without handlers', () => {
    render(<Chip>Moscow</Chip>);
    expect(screen.getByText('Moscow')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('is a toggle button with selected', async () => {
    const onSelectedChange = vi.fn();
    render(
      <Chip selected={false} onSelectedChange={onSelectedChange}>
        Spicy
      </Chip>,
    );
    const button = screen.getByRole('button', { name: 'Spicy' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(button);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it('marks the selected state', () => {
    const { container } = render(<Chip selected>Spicy</Chip>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(container.firstElementChild).toHaveClass('vui-chip--selected');
  });

  it('is a plain button with onClick', async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Reset</Chip>);
    const button = screen.getByRole('button', { name: 'Reset' });
    expect(button).not.toHaveAttribute('aria-pressed');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has a labelled remove button', async () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Kazan</Chip>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Kazan' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('disables both buttons', () => {
    render(
      <Chip onClick={() => {}} onRemove={() => {}} disabled>
        Off
      </Chip>,
    );
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
  });
});
