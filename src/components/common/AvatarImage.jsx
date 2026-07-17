import { useMemo, useState } from 'react'
import { cn } from '../../utils/helpers'
import { resolveApiAssetUrl } from '../../constants/config'

const getInitials = (name) => {
  if (!name) return 'U'

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean)
    .join('') || 'U'
}

const AvatarImage = ({ src, name, alt, className, fallbackClassName }) => {
  const [failed, setFailed] = useState(false)

  const resolvedSrc = useMemo(() => {
    if (!src) return ''
    return resolveApiAssetUrl(src)
  }, [src])

  const initials = getInitials(name || alt)

  if (!resolvedSrc || failed) {
    return (
      <div
        aria-label={alt || name || 'User avatar'}
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white font-semibold select-none overflow-hidden',
          fallbackClassName || className
        )}
      >
        <span className="leading-none">{initials}</span>
      </div>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt || name || 'User avatar'}
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

export default AvatarImage
