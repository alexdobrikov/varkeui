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
import { useIsomorphicLayoutEffect } from '../../utils/useIsomorphicLayoutEffect';

export interface PromoCarouselProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Листать слайды по таймеру. Пауза — пока на карусель наведена мышь, на ней фокус с клавиатуры
   * или вкладка скрыта. При `prefers-reduced-motion` карусель сама не листается.
   * @default true
   */
  autoPlay?: boolean;
  /**
   * Сколько миллисекунд показывается слайд.
   * @default 6000
   */
  interval?: number;
  /**
   * С какого слайда начать.
   * @default 0
   */
  defaultIndex?: number;
  /** Вызывается при смене слайда — по таймеру, стрелкой, точкой или свайпом. */
  onIndexChange?: (index: number) => void;
  /**
   * Показать под каруселью «стопку» следующих карточек, на которой лежат точки.
   * @default true
   */
  stacked?: boolean;
  /**
   * Подпись стрелки назад для скринридеров.
   * @default Previous
   */
  previousLabel?: string;
  /**
   * Подпись стрелки вперёд для скринридеров.
   * @default Next
   */
  nextLabel?: string;
  /** Подпись слайда и его точки для скринридеров. По умолчанию `2 of 5`. */
  slideLabel?: (index: number, count: number) => string;
}

const defaultSlideLabel = (index: number, count: number) => `${index + 1} of ${count}`;

export const PromoCarousel = forwardRef<HTMLDivElement, PromoCarouselProps>(function PromoCarousel(
  {
    autoPlay = true,
    interval = 6000,
    defaultIndex = 0,
    onIndexChange,
    stacked = true,
    previousLabel = 'Previous',
    nextLabel = 'Next',
    slideLabel = defaultSlideLabel,
    className,
    style,
    children,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const slides = Children.toArray(children).filter(isValidElement);
  const count = slides.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(() => Math.min(Math.max(defaultIndex, 0), count - 1));
  const [hidden, setHidden] = useState(false);
  const indexRef = useRef(index);
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  const current = Math.min(index, count - 1);

  const select = useCallback((next: number) => {
    if (indexRef.current === next) return;
    indexRef.current = next;
    setIndex(next);
    onIndexChangeRef.current?.(next);
  }, []);

  const scrollToSlide = (target: number, smooth: boolean) => {
    const viewport = viewportRef.current;
    const slide = viewport?.children[target] as HTMLElement | undefined;
    if (!viewport || !slide) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo?.({
      left: slide.offsetLeft - viewport.offsetLeft,
      behavior: smooth && !reduceMotion ? 'smooth' : 'auto',
    });
  };

  const go = (target: number) => {
    const next = (target + count) % count;
    select(next);
    scrollToSlide(next, true);
  };

  useIsomorphicLayoutEffect(() => {
    if (current > 0) scrollToSlide(current, false);
    // Только при монтировании: дальше позицию меняют go() и свайп.
  }, []);

  // Свайп и прокрутка: когда прокрутка остановилась, активным становится ближайший слайд.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const distances = Array.from(viewport.children, (child) =>
          Math.abs((child as HTMLElement).offsetLeft - viewport.offsetLeft - viewport.scrollLeft),
        );
        select(distances.indexOf(Math.min(...distances)));
      }, 120);
    };
    viewport.addEventListener('scroll', settle, { passive: true });
    return () => {
      clearTimeout(timer);
      viewport.removeEventListener('scroll', settle);
    };
  }, [select]);

  useEffect(() => {
    const update = () => setHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || count < 2) return;
    // Стрелки клавиатуры листают, только когда фокус на точках или стрелках, а не внутри слайда.
    const target = event.target as HTMLElement;
    if (!target.closest('.vui-carousel__dots, .vui-carousel__arrow')) return;
    if (event.key === 'ArrowLeft') go(current - 1);
    else if (event.key === 'ArrowRight') go(current + 1);
    else return;
    event.preventDefault();
  };

  const playing = autoPlay && count > 1;

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      {...rest}
      className={cx(
        'vui-carousel',
        stacked && 'vui-carousel--stacked',
        playing && 'vui-carousel--playing',
        hidden && 'vui-carousel--hidden',
        className,
      )}
      style={{ '--vui-carousel-interval': `${interval}ms`, ...style } as CSSProperties}
      onKeyDown={handleKeyDown}
    >
      <div className="vui-carousel__stage">
        <div ref={viewportRef} className="vui-carousel__viewport">
          {slides.map((slide, i) => (
            <div
              key={slide.key ?? i}
              className="vui-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabel(i, count)}
            >
              {slide}
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <button
              type="button"
              className="vui-carousel__arrow vui-carousel__arrow--previous"
              aria-label={previousLabel}
              onClick={() => go(current - 1)}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className="vui-carousel__arrow vui-carousel__arrow--next"
              aria-label={nextLabel}
              onClick={() => go(current + 1)}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="vui-carousel__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.key ?? i}
              type="button"
              className={cx('vui-carousel__dot', i === current && 'vui-carousel__dot--active')}
              aria-label={slideLabel(i, count)}
              aria-current={i === current || undefined}
              onClick={() => go(i)}
            >
              {i === current && (
                <span
                  className="vui-carousel__progress"
                  onAnimationEnd={playing ? () => go(current + 1) : undefined}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
