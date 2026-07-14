import { useState } from 'react'
import { formatPrice } from '../../utils/formatters'

const W = 600
const H = 200
const PAD = { top: 10, right: 10, bottom: 30, left: 50 }

const scaleX = (i, total) => {
  const safeTotal = Number.isFinite(total) ? total : 0
  if (safeTotal <= 1) {
    return W / 2
  }

  const span = W - PAD.left - PAD.right
  const step = span / (safeTotal - 1)
  const x = PAD.left + (i * step)
  return Number.isFinite(x) ? x : W / 2
}
const scaleY = (val, min, max) => {
  const range = max - min
  const safeRange = Number.isFinite(range) && range !== 0 ? range : 1
  const normalized = (val - min) / safeRange
  const clamped = Number.isFinite(normalized) ? Math.min(Math.max(normalized, 0), 1) : 0.5
  return PAD.top + (1 - clamped) * (H - PAD.top - PAD.bottom)
}

const smoothPath = (points) => {
  if (points.length < 2) return ''
  const d = [`M ${points[0].x} ${points[0].y}`]
  for (let i = 1; i < points.length; i++) {
    const mx = (points[i - 1].x + points[i].x) / 2
    d.push(`C ${mx} ${points[i - 1].y} ${mx} ${points[i].y} ${points[i].x} ${points[i].y}`)
  }
  return d.join(' ')
}

const LineChart = ({ data = [], dataKey = 'revenue', color = '#e11d48', gradientId = 'lineGrad', isCurrency = true }) => {
  const [tooltip, setTooltip] = useState(null)
  const normalizedData = data
    .map((item) => ({
      ...item,
      [dataKey]: Number(item?.[dataKey]),
    }))
    .filter((item) => Number.isFinite(item[dataKey]))

  if (!normalizedData.length) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-sm text-gray-400">
        No chart data available
      </div>
    )
  }

  const values = normalizedData.map((d) => d[dataKey])
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const span = rawMax - rawMin
  const min = Number.isFinite(rawMin) ? (span === 0 ? rawMin - 1 : rawMin * 0.9) : 0
  const max = Number.isFinite(rawMax) ? (span === 0 ? rawMax + 1 : rawMax * 1.05) : 1

  const points = normalizedData.map((d, i) => ({
    x: scaleX(i, normalizedData.length),
    y: scaleY(d[dataKey], min, max),
    value: d[dataKey],
    label: d.month || d.day || d.label || String(i + 1),
  }))

  const linePath = smoothPath(points)
  const areaPath = points.length === 1
    ? `M ${points[0].x} ${H - PAD.bottom} L ${points[0].x} ${points[0].y} L ${points[0].x} ${H - PAD.bottom} Z`
    : linePath
      + ` L ${points[points.length - 1].x} ${H - PAD.bottom}`
      + ` L ${points[0].x} ${H - PAD.bottom} Z`

  const yTicks = 4
  const yStep = Number.isFinite(max - min) && max !== min ? (max - min) / yTicks : 1

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y axis gridlines */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const val = min + i * yStep
          const y = scaleY(val, min, max)
          const labelValue = Number.isFinite(val) ? val : 0
          return (
            <g key={i}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="currentColor" opacity="0.4">
                {isCurrency ? `$${(labelValue / 1000).toFixed(0)}k` : labelValue.toFixed(0)}
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points + tooltips */}
        {points.map((pt, i) => (
          <g key={i} onMouseEnter={() => setTooltip(pt)} onMouseLeave={() => setTooltip(null)} style={{ cursor: 'pointer' }}>
            <circle cx={pt.x} cy={pt.y} r="8" fill="transparent" />
            <circle cx={pt.x} cy={pt.y} r="3.5" fill={color} stroke="white" strokeWidth="2"
              opacity={tooltip?.label === pt.label ? 1 : 0.7} />
            <text x={pt.x} y={H - 6} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">
              {pt.label}
            </text>
          </g>
        ))}

        {/* Tooltip */}
        {tooltip && (() => {
          const safeTooltipX = Number.isFinite(tooltip.x) ? tooltip.x : W / 2
          const safeTooltipY = Number.isFinite(tooltip.y) ? tooltip.y : H / 2
          const tx = safeTooltipX > W * 0.7 ? safeTooltipX - 90 : safeTooltipX + 8
          return (
            <g>
              <rect x={tx} y={safeTooltipY - 26} width="82" height="22" rx="6" fill="rgb(17,17,17)" opacity="0.92" />
              <text x={tx + 41} y={safeTooltipY - 11} textAnchor="middle" fontSize="10" fill="white" fontWeight="600">
                {isCurrency ? formatPrice(tooltip.value) : Number(tooltip.value).toLocaleString()}
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

export default LineChart
