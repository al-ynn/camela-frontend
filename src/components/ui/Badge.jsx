import { cn } from '../../utils/helpers'

const variants = {
  brand: 'badge-brand',
  success: 'badge-success',
  warning: 'badge-warning',
  info: 'badge-info',
  gray: 'badge-gray',
  danger: 'badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
  dark: 'badge bg-gray-900 text-white dark:bg-white dark:text-gray-900',
  new: 'badge bg-green-600 text-white',
}

const Badge = ({ children, variant = 'gray', className, dot = false, ...props }) => {
  return (
    <span className={cn(variants[variant], className)} {...props}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  )
}

export default Badge
