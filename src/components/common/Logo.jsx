const SIZES = {
  xs: 'w-6 h-6',
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
  '2xl': 'w-14 h-14',
}

const TEXT_SIZES = {
  xs: { name: 'text-base', sub: 'text-[8px]' },
  sm: { name: 'text-lg', sub: 'text-[9px]' },
  md: { name: 'text-xl', sub: 'text-[10px]' },
  lg: { name: 'text-2xl', sub: 'text-xs' },
  xl: { name: 'text-3xl', sub: 'text-xs' },
  '2xl': { name: 'text-4xl', sub: 'text-sm' },
}

const Logo = ({
  size = 'md',
  showText = true,
  nameClass = 'text-gray-900 dark:text-white',
  subClass = 'text-brand-600 dark:text-brand-400',
  className = '',
}) => {
  const { name: nameSize, sub: subSize } = TEXT_SIZES[size] || TEXT_SIZES.md

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/Camela Group Logo.PNG"
        alt="Camela Group"
        className={`${SIZES[size] || SIZES.md} rounded-full object-cover flex-shrink-0`}
        draggable={false}
      />
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-display font-bold tracking-tight leading-tight ${nameSize} ${nameClass}`}>
            Camela
          </span>
          <span className={`font-semibold uppercase tracking-widest leading-none ${subSize} ${subClass}`}>
            Group
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
