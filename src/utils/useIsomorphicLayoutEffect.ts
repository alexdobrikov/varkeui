import { useEffect, useLayoutEffect } from 'react';

/** useLayoutEffect в браузере и useEffect на сервере, где он не нужен и шумит в консоль. */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
