import { useState } from 'react'

const R = 70
const CX = 90
const CY = 90
const STROKE = 28

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const s = polarToCartesian(cx, cy, r, endAngle)
  const e = polarToCartesian(cx, cy, r, startAngle)
  const large = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`
}

const DonutChart = ({ data = [] }) => {
  const [hovered, setHovered] = useState(null)
  const COLORS = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
  ]

  const normalizedData = data
    .map((item, index) => ({
      category: item.category ?? item.name,
      sales: Number(item.sales ?? item.value),
      color: item.color ?? COLORS[index % COLORS.length],
    }))
    .filter((item) => Number.isFinite(item.sales))

  if (!normalizedData.length) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-sm text-gray-400">
        No chart data available
      </div>
    )
  }

  const total = normalizedData.reduce((s, d) => s + d.sales, 0)
  if (!Number.isFinite(total) || total <= 0) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-sm text-gray-400">
        No chart data available
      </div>
    )
  }
  let cumulative = 0

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-shrink-0">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {normalizedData.map((segment, i) => {
            const pct = Number.isFinite(segment.sales / total) ? segment.sales / total : 0
            const startAngle = cumulative * 360
            cumulative += pct
            const endAngle = cumulative * 360
            const isHov = hovered === i
            return (
              <path
                key={i}
                d={describeArc(CX, CY, R, startAngle, endAngle)}
                fill="none"
                stroke={segment.color}
                strokeWidth={isHov ? STROKE + 4 : STROKE}
                strokeLinecap="butt"
                style={{ transition: 'stroke-width 0.2s', cursor: 'pointer', opacity: hovered !== null && !isHov ? 0.6 : 1 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
          {/* Center text */}
          <text x={CX} y={CY - 8} textAnchor="middle" fontSize="20" fontWeight="700" fill="currentColor">
            {hovered !== null
              ? normalizedData[hovered].sales
              : total}
          </text>
          <text x={CX} y={CY + 12} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">
            {hovered !== null ? normalizedData[hovered].category.split(' ')[0] : 'Total Sales'}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 w-full">
        {normalizedData.map((segment, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 cursor-pointer group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: segment.color }} />
              <span className={`text-xs truncate transition-colors ${hovered === i ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {segment.category}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${(segment.sales / total) * 100}%`,
                        background: segment.color
                    }}
                />
              </div>
              <span className="text-xs font-semibold ...">
                  {((segment.sales / total) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DonutChart
