import { cn } from '../../utils/helpers'

const Skeleton = ({ className, ...props }) => (
  <div
    className={cn(
      'shimmer dark:shimmer-dark rounded-lg animate-pulse bg-gray-200 dark:bg-gray-800',
      className
    )}
    {...props}
  />
)

export const ProductCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="w-full aspect-product" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  </div>
)

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
)

export const HeroSkeleton = () => (
  <div className="w-full h-[80vh] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-none" />
)

export const DetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <div className="space-y-4">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    </div>
    <div className="space-y-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-4/5" />
      <Skeleton className="h-8 w-3/5" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
)

export default Skeleton
