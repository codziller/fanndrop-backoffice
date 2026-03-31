import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration = 1200): number {
  const [current, setCurrent] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const progress = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(progress * target));

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return current;
}
