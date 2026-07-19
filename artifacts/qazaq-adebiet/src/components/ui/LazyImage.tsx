import { useState, useRef, useEffect, type ImgHTMLAttributes } from 'react';
import { Skeleton } from '@/components/PageSkeleton';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: string;      // e.g. "16/9", "1/1"
  skeletonClass?: string;
}

/**
 * Intersection-Observer–based lazy image loader.
 * Shows a shimmer skeleton until the image enters the viewport and loads.
 */
export default function LazyImage({
  src,
  alt,
  fallback = '/placeholder.svg',
  aspectRatio,
  skeletonClass = '',
  className = '',
  style,
  ...rest
}: LazyImageProps) {
  const [loaded, setLoaded]   = useState(false);
  const [error, setError]     = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const wrapStyle = aspectRatio
    ? { aspectRatio, ...style }
    : style;

  return (
    <div ref={ref} style={wrapStyle} className={`relative overflow-hidden ${aspectRatio ? 'w-full' : ''}`}>
      {!loaded && (
        <Skeleton
          className={`absolute inset-0 w-full h-full ${skeletonClass}`}
          rounded="rounded-none"
        />
      )}
      {visible && (
        <img
          src={error ? fallback : src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
          className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...rest}
        />
      )}
    </div>
  );
}
