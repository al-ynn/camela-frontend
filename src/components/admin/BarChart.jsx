import { useState } from 'react'

const BarChart = ({ data = [], dataKey = 'revenue', color = '#e11d48', isCurrency = false }) => {
  const [hovered, setHovered] = useState(null)
  const normalizedData = data
    .map((item) => ({
      ...item,
      [dataKey]: Number(item?.[dataKey]),
    }))
    .filter((item) => Number.isFinite(item[dataKey]))

  if (!normalizedData.length) {
    return (
      <div className="flex items-center justify-center h-40 w-full text-sm text-gray-400">
        No chart data available
      </div>
    )
  }

  const values = normalizedData.map((d) => d[dataKey])
  const max = Math.max(...values)
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1

  return (
    <div className="flex items-end gap-1.5 h-40 w-full">
      {normalizedData.map((d, i) => {
        const heightPct = Number.isFinite(d[dataKey]) ? (d[dataKey] / safeMax) * 100 : 0
        const safeHeightPct = Number.isFinite(heightPct) ? Math.max(heightPct, d[dataKey] > 0 ? 4 : 0) : 0
        const isHov = hovered === i
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1.5 group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            <div className={`text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 whitespace-nowrap transition-opacity ${isHov ? 'opacity-100' : 'opacity-0'}`}>
              {isCurrency ? `$${d[dataKey].toLocaleString()}` : d[dataKey].toLocaleString()}
            </div>

            {/* Bar */}
            <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
              <div
                className="w-full rounded-t-lg transition-all duration-300"
                style={{
                  height: `${safeHeightPct}%`,
                  background: isHov
                    ? `linear-gradient(to top, ${color}, ${color}cc)`
                    : `linear-gradient(to top, ${color}99, ${color}55)`,
                  minHeight: '4px',
                }}
              />
            </div>

            {/* Label */}
            <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500 truncate w-full text-center">
              {d.month || d.day || d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default BarChart
