import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ImageInput } from './ImageInput';

const png = () => new File(['x'], 'cover.png', { type: 'image/png' });

describe('ImageInput', () => {
  it('passes the chosen file to onFileSelect', async () => {
    const onFileSelect = vi.fn();
    render(<ImageInput label="Cover" onFileSelect={onFileSelect} />);
    const file = png();
    await userEvent.upload(screen.getByLabelText('Cover'), file);
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('accepts a dropped file', async () => {
    const onFileSelect = vi.fn();
    const { container } = render(<ImageInput onFileSelect={onFileSelect} />);
    const file = png();
    fireEvent.drop(container.querySelector('.vui-image-input__field')!, {
      dataTransfer: { files: [file] },
    });
    await waitFor(() => expect(onFileSelect).toHaveBeenCalledWith(file));
  });

  it('shows the preview, replace label and remove button when there is a value', async () => {
    const onRemove = vi.fn();
    const { container } = render(
      <ImageInput
        value="/cover.png"
        onFileSelect={() => {}}
        onRemove={onRemove}
        replaceLabel="Change"
        removeLabel="Drop"
      />,
    );
    expect(container.querySelector('.vui-image-input__preview img')).toHaveAttribute(
      'src',
      '/cover.png',
    );
    expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Drop' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('shows the error instead of the hint', () => {
    const { container } = render(
      <ImageInput hint="Up to 25 MB" error="Too big" onFileSelect={() => {}} />,
    );
    expect(container.firstElementChild).toHaveClass('vui-image-input--invalid');
    expect(screen.getByText('Too big')).toBeInTheDocument();
    expect(screen.queryByText('Up to 25 MB')).not.toBeInTheDocument();
  });
});

describe('ImageInput sources and errors', () => {
  it('rejects an oversized dropped image without uploading', async () => {
    const upload = vi.fn();
    const { container } = render(
      <ImageInput maxSize={1} onFileSelect={upload} messages={{ size: 'Too large' }} />,
    );
    fireEvent.drop(container.querySelector('.vui-image-input__field')!, {
      dataTransfer: { files: [new File(['xx'], 'x.png', { type: 'image/png' })] },
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('Too large');
    expect(upload).not.toHaveBeenCalled();
  });
  it('accepts an image pasted into the field', async () => {
    const upload = vi.fn();
    const { container } = render(<ImageInput allowPaste onFileSelect={upload} />);
    const file = png();
    fireEvent.paste(container.querySelector('.vui-image-input__field')!, {
      clipboardData: { items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }] },
    });
    await screen.findByRole('button', { name: 'Upload' });
    await waitFor(() => expect(upload).toHaveBeenCalledWith(file));
  });
  it('accepts an https URL and rejects javascript URLs', async () => {
    const selectUrl = vi.fn();
    render(<ImageInput onFileSelect={() => {}} onUrlSelect={selectUrl} />);
    await userEvent.click(screen.getByRole('button', { name: 'Use link' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'Use link' }), 'javascript:alert(1)');
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('http');
    expect(selectUrl).not.toHaveBeenCalled();
    await userEvent.clear(screen.getByRole('textbox', { name: 'Use link' }));
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Use link' }),
      'https://example.com/cover.webp',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(selectUrl).toHaveBeenCalledWith('https://example.com/cover.webp');
  });
  it('resets loading after an upload error and allows a retry', async () => {
    const upload = vi
      .fn()
      .mockRejectedValueOnce(new Error('Upload timed out'))
      .mockResolvedValueOnce(undefined);
    render(<ImageInput label="Retry cover" onFileSelect={upload} />);
    await userEvent.upload(screen.getByLabelText('Retry cover'), png());
    expect(await screen.findByRole('alert')).toHaveTextContent('Upload timed out');
    await userEvent.upload(screen.getByLabelText('Retry cover'), png());
    await waitFor(() => expect(upload).toHaveBeenCalledTimes(2));
  });
});
