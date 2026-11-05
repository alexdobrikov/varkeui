import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImageInputError, prepareImage, validateImage } from './prepareImage';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('image preparation', () => {
  it('rejects oversized originals before decoding or calling upload', async () => {
    const decode = vi.fn();
    vi.stubGlobal('createImageBitmap', decode);
    await expect(
      prepareImage(new File(['12345'], 'cover.png', { type: 'image/png' }), {
        maxSize: 4,
        webp: true,
      }),
    ).rejects.toMatchObject({ code: 'size' });
    expect(decode).not.toHaveBeenCalled();
  });
  it('validates accepted types for dropped and pasted files', () => {
    expect(() => validateImage(new File(['x'], 'cover.txt', { type: 'text/plain' }))).toThrow(
      ImageInputError,
    );
    expect(() => validateImage(new File(['x'], 'cover.jpg'), undefined, '.jpg,.png')).not.toThrow();
  });
  it('preserves an existing small WebP and releases the decoded bitmap', async () => {
    const close = vi.fn();
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn().mockResolvedValue({ width: 640, height: 480, close }),
    );
    const file = new File(['webp'], 'cover.webp', { type: 'image/webp' });
    expect(await prepareImage(file, { webp: true })).toBe(file);
    expect(close).toHaveBeenCalledOnce();
  });
  it('rejects excessive dimensions and releases resources', async () => {
    const close = vi.fn();
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn().mockResolvedValue({ width: 10000, height: 10000, close }),
    );
    await expect(
      prepareImage(new File(['x'], 'cover.png', { type: 'image/png' }), { webp: true }),
    ).rejects.toMatchObject({ code: 'processing' });
    expect(close).toHaveBeenCalledOnce();
  });
  it('resizes to WebP before uploading and releases the bitmap', async () => {
    const close = vi.fn();
    const drawImage = vi.fn();
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn().mockResolvedValue({ width: 4000, height: 2000, close }),
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) =>
      callback(new Blob(['encoded'], { type: 'image/webp' })),
    );
    const result = await prepareImage(new File(['jpeg'], 'cover.jpg', { type: 'image/jpeg' }), {
      webp: true,
    });
    expect(result.name).toBe('cover.webp');
    expect(result.type).toBe('image/webp');
    expect(drawImage.mock.calls[0].slice(1)).toEqual([0, 0, 2560, 1280]);
    expect(close).toHaveBeenCalledOnce();
  });
});
