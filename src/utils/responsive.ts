export const breakpoints = ['sm', 'md', 'lg'] as const;
export type Breakpoint = (typeof breakpoints)[number];

/** Значение для всех ширин или по брейкпоинтам: `{ base: 2, md: 6 }`. */
export type Responsive<T> = T | ({ base?: T } & Partial<Record<Breakpoint, T>>);

export function responsiveVars<T extends string | number>(
  name: string,
  value: Responsive<T> | undefined,
): Record<string, T | undefined> {
  if (value === undefined) return {};
  if (typeof value !== 'object') return { [name]: value };
  const vars: Record<string, T | undefined> = { [name]: value.base };
  for (const breakpoint of breakpoints) vars[`${name}-${breakpoint}`] = value[breakpoint];
  return vars;
}
