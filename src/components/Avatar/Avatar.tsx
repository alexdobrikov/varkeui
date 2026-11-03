import {
  Children,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';

export type AvatarSize = 'sm' | 'md' | 'lg';

/** Фоны для инициалов: насыщенные, белый текст читается на каждом. */
const COLORS = [
  '#e5484d',
  '#f76b15',
  '#d6409f',
  '#8e4ec6',
  '#3e63dd',
  '#0090ff',
  '#12a594',
  '#30a46c',
  '#ad7f58',
  '#5b5bd6',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
  return letters.toUpperCase();
}

/** Цвет по имени: у одного человека он одинаковый везде. */
function colorOf(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return COLORS[Math.abs(h) % COLORS.length];
}

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Имя: из него инициалы, цвет фона и подпись для скринридеров. */
  name: string;
  /** Фото. Без него — инициалы на цветном фоне. */
  src?: string;
  /**
   * Диаметр: 32, 40 или 56 px.
   * @default md
   */
  size?: AvatarSize;
}

/** Аватар человека: фото или инициалы на цветном круге. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'md', className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      title={name}
      {...rest}
      className={cx('vui-avatar', `vui-avatar--${size}`, className)}
      style={{ ...(src ? null : { background: colorOf(name) }), ...style } as CSSProperties}
    >
      {src ? <img alt="" src={src} /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
});

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Аватары (Avatar). */
  children: ReactNode;
  /** Сколько показать; остальные — кружком «+N». */
  max?: number;
  /**
   * Размер всех аватаров группы (перекрывает size у отдельных Avatar).
   * @default md
   */
  size?: AvatarSize;
}

/** Несколько аватаров рядом, немного наезжая друг на друга: кто в комнате, кто участвует. */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { children, max, size = 'md', className, ...rest },
  ref,
) {
  const items = Children.toArray(children);
  const shown = max !== undefined && items.length > max ? items.slice(0, max) : items;
  const hidden = items.length - shown.length;
  return (
    <div
      ref={ref}
      role="group"
      {...rest}
      className={cx('vui-avatar-group', `vui-avatar-group--${size}`, className)}
    >
      {shown}
      {hidden > 0 && (
        <span
          className={cx('vui-avatar', `vui-avatar--${size}`, 'vui-avatar--more')}
          aria-label={`+${hidden}`}
        >
          <span aria-hidden="true">+{hidden}</span>
        </span>
      )}
    </div>
  );
});
