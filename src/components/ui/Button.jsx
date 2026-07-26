import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/helpers'

const variants = {
  primary: 'btn-primary',
  brand: 'btn-brand',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
}

const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
}

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        className={cn(
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          'relative',
          className
        )}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {loading && (
          <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" size={16} />
        )}
        <span className={cn('flex items-center gap-2', loading && 'invisible')}>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
