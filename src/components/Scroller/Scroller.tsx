import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { toCssSize } from '../../utils/toCssSize';

export interface ScrollerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Расстояние между элементами.
   * @default 16
   */
  gap?: string | number;
  /**
   * Отступ ленты по краям. Контент выровнен по сетке страницы, а прокручивается до самого края
   * — задайте здесь горизонтальный отступ страницы и уберите его у контейнера.
   * @default 0
   */
  inset?: string | number;
  /**
   * Прилипать к началу элемента после прокрутки.
   * @default true
   */
  snap?: boolean;
  /**
   * Стрелки прокрутки: `auto` — при наведении мышью, `always` — всегда, `never` — без них.
   * Скрываются, когда листать некуда.
   * @default auto
   */
  controls?: 'auto' | 'always' | 'never';
  /**
   * Затухание по краям, за которыми есть ещё элементы.
   * @default true
   */
  fade?: boolean;
  /**
   * Подпись стрелки назад.
   * @default Previous
   */
  previousLabel?: string;
  /**
   * Подпись стрелки вперёд.
   * @default Next
   */
  nextLabel?: string;
}

interface Edges {
  start: boolean;
  end: boolean;
}

export const Scroller = forwardRef<HTMLDivElement, ScrollerProps>(function Scroller(
  {
    gap,
    inset,
    snap = true,
    controls = 'auto',
    fade = true,
    previousLabel = 'Previous',
    nextLabel = 'Next',
    className,
    style,
    children,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edges>({ start: false, end: false });

  const update = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const { scrollLeft, scrollWidth, clientWidth } = viewport;
    const next = { start: scrollLeft > 1, end: scrollLeft + clientWidth < scrollWidth - 1 };
    setEdges((prev) => (prev.start === next.start && prev.end === next.end ? prev : next));
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    update();
    viewport.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(viewport);
    for (const child of Array.from(viewport.children)) observer?.observe(child);
    return () => {
      viewport.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [update, children]);

  const scroll = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.8,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const viewport = viewportRef.current;
    if (event.defaultPrevented || !viewport) return;
    if (event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    viewport.scrollTo({ left: event.key === 'Home' ? 0 : viewport.scrollWidth });
  };

  const vars = {
    '--vui-scroller-gap': toCssSize(gap),
    '--vui-scroller-inset': toCssSize(inset),
  } as CSSProperties;

  return (
    <div
      className={cx(
        'vui-scroller',
        `vui-scroller--controls-${controls}`,
        snap && 'vui-scroller--snap',
        fade && edges.start && 'vui-scroller--fade-start',
        fade && edges.end && 'vui-scroller--fade-end',
        className,
      )}
      style={{ ...vars, ...style }}
    >
      <div
        ref={mergeRefs(viewportRef, ref)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        {...rest}
        className="vui-scroller__viewport"
      >
        {Children.map(children, (child) =>
          isValidElement(child) ? <div className="vui-scroller__item">{child}</div> : child,
        )}
      </div>
      {controls !== 'never' && (
        <>
          <button
            type="button"
            className="vui-scroller__button vui-scroller__button--previous"
            aria-label={previousLabel}
            hidden={!edges.start}
            tabIndex={-1}
            onClick={() => scroll(-1)}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className="vui-scroller__button vui-scroller__button--next"
            aria-label={nextLabel}
            hidden={!edges.end}
            tabIndex={-1}
            onClick={() => scroll(1)}
          >
            <ChevronRightIcon />
          </button>
        </>
      )}
    </div>
  );
});
