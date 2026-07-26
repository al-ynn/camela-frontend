import { cn } from '../../utils/helpers'

const Spinner = ({ size = 'md', className }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12', xl: 'h-16 w-16' }
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-200 border-t-brand-600 dark:border-gray-700 dark:border-t-brand-500',
        sizes[size],
        className
      )}
    />
  )
}

export const FullPageSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
    </div>
  </div>
)

export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Spinner size="lg" />
  </div>
)

export default Spinner
