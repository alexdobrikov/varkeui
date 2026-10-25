import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from './store';
import { Toaster } from './Toaster';

describe('toast and Toaster', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    act(() => {
      toast.dismiss();
      vi.advanceTimersByTime(500);
    });
    vi.useRealTimers();
  });

  it('shows a toast and hides it after the duration', () => {
    render(<Toaster />);
    act(() => {
      toast('Saved', { duration: 1000 });
    });
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('status')).toHaveClass('vui-toast--closing');
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('uses alert role for errors and adds the tone icon', () => {
    render(<Toaster />);
    act(() => {
      toast.error('No connection');
    });
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('vui-toast--danger');
    expect(alert.querySelector('.vui-toast__icon svg')).not.toBeNull();
  });

  it('runs the action and closes the toast', async () => {
    const onUndo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast('Deleted', { action: { label: 'Undo', onClick: onUndo }, duration: Infinity });
    });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledOnce();
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(screen.queryByText('Deleted')).not.toBeInTheDocument();
  });

  it('updates a toast with the same id instead of adding one', () => {
    render(<Toaster />);
    act(() => {
      toast('Uploading…', { id: 'upload', duration: Infinity });
      toast.success('Uploaded', { id: 'upload' });
    });
    expect(screen.queryByText('Uploading…')).not.toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
  });

  it('shows at most max toasts', () => {
    render(<Toaster max={2} />);
    act(() => {
      toast('One', { duration: Infinity });
      toast('Two', { duration: Infinity });
      toast('Three', { duration: Infinity });
    });
    expect(screen.queryByText('One')).not.toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });
});
