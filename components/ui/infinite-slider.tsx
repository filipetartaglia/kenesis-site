'use client';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

/**
 * Infinite slider using pure CSS animation — perfectly smooth, no Framer Motion
 * loop quirks. We measure one set of children, then render enough copies to
 * guarantee seamless looping regardless of viewport width.
 */
export function InfiniteSlider({
  children,
  gap = 16,
  duration = 30,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [ref, { width, height }] = useMeasure();
  const [copies, setCopies] = useState(4);
  const paused = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Ensure we have enough copies to fill twice the viewport + one set = seamless
  useEffect(() => {
    const size = direction === 'horizontal' ? width : height;
    if (size > 0) {
      const viewportSize =
        direction === 'horizontal' ? window.innerWidth : window.innerHeight;
      // need at least 2 full lengths to loop; add a safety margin
      const needed = Math.max(4, Math.ceil((viewportSize * 2.5) / size) + 1);
      setCopies(needed);
    }
  }, [width, height, direction]);

  const isHorizontal = direction === 'horizontal';
  const size = isHorizontal ? width : height;
  const animSize = size + gap; // one "lap" = one set + one gap

  const animName = reverse ? `kenesis-slider-rev-${animSize}` : `kenesis-slider-${animSize}`;

  const keyframes = reverse
    ? `@keyframes ${animName} { from { transform: translate${isHorizontal ? 'X' : 'Y'}(0); } to { transform: translate${isHorizontal ? 'X' : 'Y'}(${animSize}px); } }`
    : `@keyframes ${animName} { from { transform: translate${isHorizontal ? 'X' : 'Y'}(0); } to { transform: translate${isHorizontal ? 'X' : 'Y'}(-${animSize}px); } }`;

  const trackStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    gap: `${gap}px`,
    width: 'max-content',
    animation: size > 0 ? `${animName} ${duration}s linear infinite` : 'none',
    animationPlayState: 'running',
    // start from correct position for reverse
    transform: reverse ? `translate${isHorizontal ? 'X' : 'Y'}(-${animSize}px)` : undefined,
  };

  return (
    <div className={cn('overflow-hidden', className)}>
      <style>{keyframes}</style>
      <div
        ref={trackRef}
        style={trackStyle}
        onMouseEnter={() => {
          if (durationOnHover && trackRef.current) {
            trackRef.current.style.animationDuration = `${durationOnHover}s`;
          }
        }}
        onMouseLeave={() => {
          if (durationOnHover && trackRef.current) {
            trackRef.current.style.animationDuration = `${duration}s`;
          }
        }}
      >
        {/* First copy is measured */}
        <div ref={ref} style={{ display: 'contents' }}>
          {children}
        </div>
        {/* Extra copies for seamless loop */}
        {Array.from({ length: copies }).map((_, i) => (
          <div key={i} style={{ display: 'contents' }}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
