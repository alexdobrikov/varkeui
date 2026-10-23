export const toCssSize = (value: string | number | undefined) =>
  typeof value === 'number' ? `${value}px` : value;
