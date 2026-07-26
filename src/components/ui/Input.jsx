import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      className,
      containerClassName,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="label-base">
            {label}
            {required && <span className="text-brand-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-4 text-gray-400 dark:text-gray-500 pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'input-base',
              prefix && 'pl-10',
              suffix && 'pr-10',
              error &&
                'border-brand-400 focus:border-brand-500 focus:ring-brand-500/20 dark:border-brand-500',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-4 text-gray-400 dark:text-gray-500">{suffix}</div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
