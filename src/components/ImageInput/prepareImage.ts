export interface WebPOptions {
  /** Longest edge after resizing. @default 2560 */
  maxDimension?: number;
  /** WebP encoder quality (0…1). @default 0.82 */
  quality?: number;
}

export class ImageInputError extends Error {
  constructor(
    public code: 'size' | 'type' | 'processing' | 'clipboard',
    message: string,
  ) {
    super(message);
    this.name = 'ImageInputError';
  }
}

/** Bound browser work and release the timer on both success and failure. */
export function imageTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new ImageInputError('processing', 'Image processing timed out')),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export function validateImage(file: File, maxSize?: number, accept = 'image/*'): void {
  if (maxSize !== undefined && file.size > maxSize)
    throw new ImageInputError('size', 'Image is too large');
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const supported = accept.split(',').some((rule) => {
    const item = rule.trim().toLowerCase();
    if (item.startsWith('.')) return name.endsWith(item);
    if (item === 'image/*')
      return mime.startsWith('image/') || (!mime && /\.(png|jpe?g|webp|gif|avif|bmp)$/i.test(name));
    return mime === item;
  });
  if (!supported) throw new ImageInputError('type', 'Select a supported image');
}

async function decodeImage(
  file: File,
): Promise<{ image: CanvasImageSource; width: number; height: number; close: () => void }> {
  if (typeof createImageBitmap === 'function') {
    let expired = false;
    const pending = createImageBitmap(file).then((bitmap) => {
      if (expired) bitmap.close();
      return bitmap;
    });
    try {
      const bitmap = await imageTimeout(pending);
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch (error) {
      expired = true;
      throw error;
    }
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    await imageTimeout(
      new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () =>
          reject(new ImageInputError('processing', 'Unable to decode this image'));
        image.src = url;
      }),
    );
    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    image.src = '';
    URL.revokeObjectURL(url);
    throw error;
  }
}

/** Process locally before uploading. Animated inputs are converted to a still preview. */
export async function prepareImage(
  file: File,
  options: { maxSize?: number; accept?: string; webp?: boolean | WebPOptions } = {},
): Promise<File> {
  validateImage(file, options.maxSize, options.accept);
  if (!options.webp) return file;
  const settings = typeof options.webp === 'object' ? options.webp : {};
  const maxDimension = settings.maxDimension ?? 2560;
  const quality = settings.quality ?? 0.82;
  if (!Number.isFinite(maxDimension) || maxDimension <= 0 || quality < 0 || quality > 1)
    throw new ImageInputError('processing', 'Invalid image processing options');
  const decoded = await decodeImage(file);
  try {
    if (!decoded.width || !decoded.height || decoded.width * decoded.height > 40000000)
      throw new ImageInputError('processing', 'Image dimensions are too large');
    // Avoid a second lossy encode when several upload layers call this helper.
    if (file.type === 'image/webp' && Math.max(decoded.width, decoded.height) <= maxDimension)
      return file;
    const ratio = Math.min(1, maxDimension / Math.max(decoded.width, decoded.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(decoded.width * ratio));
    canvas.height = Math.max(1, Math.round(decoded.height * ratio));
    const context = canvas.getContext('2d');
    if (!context) throw new ImageInputError('processing', 'Unable to process this image');
    context.drawImage(decoded.image, 0, 0, canvas.width, canvas.height);
    const blob = await imageTimeout(
      new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (result) => {
            if (result?.type === 'image/webp') resolve(result);
            else reject(new ImageInputError('processing', 'WebP is not supported in this browser'));
          },
          'image/webp',
          quality,
        ),
      ),
    );
    const result = new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'image'}.webp`, {
      type: 'image/webp',
    });
    validateImage(result, options.maxSize);
    return result;
  } finally {
    decoded.close();
  }
}
