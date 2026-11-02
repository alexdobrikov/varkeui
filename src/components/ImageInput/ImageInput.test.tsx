import { fireEvent, render, screen } from '@testing-library/react';
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

  it('accepts a dropped file', () => {
    const onFileSelect = vi.fn();
    const { container } = render(<ImageInput onFileSelect={onFileSelect} />);
    const file = png();
    fireEvent.drop(container.querySelector('.vui-image-input__field')!, {
      dataTransfer: { files: [file] },
    });
    expect(onFileSelect).toHaveBeenCalledWith(file);
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
