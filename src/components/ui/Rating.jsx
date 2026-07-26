import { Star } from 'lucide-react'
import { cn } from '../../utils/helpers'

const Rating = ({ rating = 0, count, size = 'sm', showCount = true, className }) => {
  const sizes = { xs: 10, sm: 13, md: 16, lg: 20 }
  const starSize = sizes[size] || sizes.sm

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating)
          const half = !filled && star === Math.ceil(rating) && rating % 1 !== 0

          return (
            <span key={star} className="relative inline-block">
              <Star
                size={starSize}
                className="text-gray-200 dark:text-gray-700"
                fill="currentColor"
              />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? '100%' : '50%' }}
                >
                  <Star
                    size={starSize}
                    className="text-amber-400"
                    fill="currentColor"
                  />
                </span>
              )}
            </span>
          )
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          ({count.toLocaleString()})
        </span>
      )}
      {showCount && count === undefined && rating > 0 && (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default Rating
