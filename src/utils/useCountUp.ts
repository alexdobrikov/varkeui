import { useRef, useState, useSyncExternalStore } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

const noop = () => () => {};
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Число, которое плавно доходит до `target`: при появлении — от нуля, при смене — от текущего
 * значения. Без анимации, если `enabled` ложно, `target` не целое число или в системе отключено
 * движение (`prefers-reduced-motion`).
 *
 * Если компонент пришёл с сервером (SSR) и гидрируется, число сразу конечное: в HTML уже было
 * верное значение, и откат к нулю выглядел бы как сбой. От нуля считает только то, что появилось
 * в браузере уже после загрузки, — например, после запроса данных.
 */
export function useCountUp(target: unknown, enabled: boolean, duration = 700): unknown {
  const animatable = enabled && typeof target === 'number' && Number.isInteger(target);
  // Во время гидрации React берёт серверный снимок (false), после неё — клиентский (true).
  const clientMounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [fromZero] = useState(clientMounted);
  const [shown, setShown] = useState<unknown>(target);
  const current = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!animatable) {
      current.current = typeof target === 'number' ? target : null;
      setShown(target);
      return;
    }
    const to = target as number;
    const from = current.current ?? (fromZero ? 0 : to);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (from === to || reduceMotion || duration <= 0) {
      current.current = to;
      setShown(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.round(from + (to - from) * easeOutCubic(progress));
      current.current = value;
      setShown(value);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    current.current = from;
    setShown(from);
    frame = requestAnimationFrame(tick);
    // Прерванная анимация продолжится от того числа, на котором остановилась.
    return () => cancelAnimationFrame(frame);
  }, [target, animatable, duration, fromZero]);

  return animatable ? shown : target;
}
