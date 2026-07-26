import { useState } from 'react'
import { cn } from '../../utils/helpers'

const LazyImage = ({
  src,
  alt,
  className,
  containerClassName,
  objectFit = 'cover',
  placeholder,
  fallback = 'https://via.placeholder.com/400x400?text=No+Image',
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {!loaded && !error && (
        <div className="absolute inset-0 shimmer dark:shimmer-dark rounded-lg" />
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          objectFit === 'contain' ? 'object-contain' : 'object-cover',
          className
        )}
      />
    </div>
  )
}

export default LazyImage
