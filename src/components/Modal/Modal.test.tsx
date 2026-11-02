import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

// jsdom не умеет showModal/close — подставляем минимальную реализацию.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

describe('Modal', () => {
  it('opens and closes with the open prop', () => {
    const { container, rerender } = render(<Modal open={false} onClose={() => {}} title="Title" />);
    const dialog = container.querySelector('dialog')!;
    expect(dialog).not.toHaveAttribute('open');
    rerender(<Modal open onClose={() => {}} title="Title" />);
    expect(dialog).toHaveAttribute('open');
    rerender(<Modal open={false} onClose={() => {}} title="Title" />);
    expect(dialog).not.toHaveAttribute('open');
  });

  it('labels the dialog with title and description', () => {
    render(<Modal open onClose={() => {}} title="New lesson" description="Add a cover" />);
    const dialog = screen.getByRole('dialog', { name: 'New lesson' });
    expect(dialog).toHaveAccessibleDescription('Add a cover');
  });

  it('calls onClose from the close button, Esc and the backdrop', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} title="Title" closeLabel="Hide">
        <p>Body</p>
      </Modal>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Hide' }));
    const dialog = container.querySelector('dialog')!;
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await userEvent.click(dialog);
    await userEvent.click(screen.getByText('Body'));
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('keeps the backdrop click when closeOnBackdrop is false', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} closeOnBackdrop={false} title="T" />,
    );
    await userEvent.click(container.querySelector('dialog')!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('centers the header when there is an icon and renders actions', () => {
    const { container } = render(
      <Modal
        open
        onClose={() => {}}
        icon="📖"
        title="T"
        actions={<button type="button">OK</button>}
        size="sm"
      />,
    );
    const dialog = container.querySelector('dialog')!;
    expect(dialog).toHaveClass('vui-modal', 'vui-modal--sm', 'vui-modal--centered');
    expect(container.querySelector('.vui-modal__actions')).toHaveTextContent('OK');
  });
});
