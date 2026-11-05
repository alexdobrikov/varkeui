import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

describe('ImageInput page paste', () => {
  afterEach(() => vi.restoreAllMocks());
  const visible = () =>
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      right: 300,
      bottom: 200,
      width: 300,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
  const pasteImage = (target: Element | Document = document) => {
    const file = png();
    const accepted = fireEvent.paste(target, {
      clipboardData: { items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }] },
    });
    return { file, accepted };
  };

  it('pastes without focus, chooses one field and prefers the last interacted field', async () => {
    visible();
    const first = vi.fn();
    const second = vi.fn();
    const { container } = render(
      <>
        <ImageInput allowPaste onFileSelect={first} />
        <ImageInput allowPaste onFileSelect={second} />
      </>,
    );
    const pasted = pasteImage();
    expect(pasted.accepted).toBe(false);
    await waitFor(() => expect(first).toHaveBeenCalledWith(pasted.file));
    expect(second).not.toHaveBeenCalled();
    fireEvent.pointerDown(container.querySelectorAll('.vui-image-input__field')[1]);
    const next = pasteImage();
    await waitFor(() => expect(second).toHaveBeenCalledWith(next.file));
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('never steals paste from a text input, textarea, contenteditable or URL field', async () => {
    visible();
    const upload = vi.fn();
    render(
      <>
        <input aria-label="Title" />
        <textarea aria-label="Body" />
        <div contentEditable role="textbox" aria-label="Editor" tabIndex={0} />
        <input type="url" aria-label="URL" />
        <ImageInput allowPaste onFileSelect={upload} />
      </>,
    );
    for (const name of ['Title', 'Body', 'Editor', 'URL']) {
      const input = screen.getByRole('textbox', { name });
      input.focus();
      expect(pasteImage(input).accepted).toBe(true);
      expect(pasteImage().accepted).toBe(true);
    }
    await Promise.resolve();
    expect(upload).not.toHaveBeenCalled();
  });

  it('does not duplicate a paste handled by the component', async () => {
    visible();
    const upload = vi.fn();
    const { container } = render(<ImageInput allowPaste onFileSelect={upload} />);
    pasteImage(container.querySelector('.vui-image-input__field')!);
    await waitFor(() => expect(upload).toHaveBeenCalledTimes(1));
  });

  it('ignores disabled, invisible, out-of-viewport and unmounted inputs', async () => {
    visible();
    const upload = vi.fn();
    const rendered = render(<ImageInput disabled allowPaste onFileSelect={upload} />);
    expect(pasteImage().accepted).toBe(true);
    rendered.rerender(<ImageInput style={{ display: 'none' }} allowPaste onFileSelect={upload} />);
    // Real browsers give descendants of display:none no layout boxes.
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    expect(pasteImage().accepted).toBe(true);
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue({
      top: 9000,
      left: 0,
      right: 300,
      bottom: 9200,
      width: 300,
      height: 200,
      x: 0,
      y: 9000,
      toJSON: () => ({}),
    });
    expect(pasteImage().accepted).toBe(true);
    rendered.unmount();
    expect(pasteImage().accepted).toBe(true);
    await Promise.resolve();
    expect(upload).not.toHaveBeenCalled();
  });

  it('pastes only into the top modal, never the page behind it', async () => {
    visible();
    const page = vi.fn();
    const modal = vi.fn();
    const { rerender } = render(
      <>
        <ImageInput allowPaste onFileSelect={page} />
        <dialog open>
          <ImageInput allowPaste onFileSelect={modal} />
        </dialog>
      </>,
    );
    pasteImage();
    await waitFor(() => expect(modal).toHaveBeenCalledOnce());
    expect(page).not.toHaveBeenCalled();
    rerender(
      <>
        <ImageInput allowPaste onFileSelect={page} />
        <dialog open>No image input here</dialog>
      </>,
    );
    expect(pasteImage().accepted).toBe(true);
    expect(page).not.toHaveBeenCalled();
  });

  it('does not route repeated paste into another input during an upload', async () => {
    visible();
    let resolve!: () => void;
    const pending = new Promise<void>((done) => {
      resolve = done;
    });
    const first = vi.fn(() => pending);
    const other = vi.fn();
    render(
      <>
        <ImageInput allowPaste onFileSelect={first} />
        <ImageInput allowPaste onFileSelect={other} />
      </>,
    );
    pasteImage();
    pasteImage();
    await waitFor(() => expect(first).toHaveBeenCalledOnce());
    expect(other).not.toHaveBeenCalled();
    resolve();
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Upload' })[0]).toBeEnabled());
  });

  it('preserves text-only paste and opt-out behaviour', () => {
    visible();
    const upload = vi.fn();
    render(<ImageInput onFileSelect={upload} />);
    expect(pasteImage().accepted).toBe(true);
    expect(
      fireEvent.paste(document, {
        clipboardData: { items: [{ kind: 'string', type: 'text/plain' }] },
      }),
    ).toBe(true);
    expect(upload).not.toHaveBeenCalled();
  });
});
