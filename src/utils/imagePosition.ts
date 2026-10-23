export type ImagePosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

const positions: Record<ImagePosition, [string, string, string]> = {
  center: ['center', 'center', 'center'],
  top: ['center', 'flex-start', 'center top'],
  bottom: ['center', 'flex-end', 'center bottom'],
  left: ['flex-start', 'center', 'left center'],
  right: ['flex-end', 'center', 'right center'],
  'top-left': ['flex-start', 'flex-start', 'left top'],
  'top-right': ['flex-end', 'flex-start', 'right top'],
  'bottom-left': ['flex-start', 'flex-end', 'left bottom'],
  'bottom-right': ['flex-end', 'flex-end', 'right bottom'],
};

/** Флекс-выравнивание и object-position для картинки, прижатой к краю или углу. */
export function imagePositionVars(position: ImagePosition) {
  const [justify, align, objectPosition] = positions[position];
  return { justify, align, objectPosition };
}
