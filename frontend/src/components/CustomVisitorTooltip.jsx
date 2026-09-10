import React from 'react'
import { Users, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react'

/**
 * High-contrast, modern, accessible visitor trend chart tooltip.
 * Adapts text and badge color dynamically based on bar crowd density/threshold.
 */
export default function CustomVisitorTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  const item = payload[0]
  const val = Number(item.value ?? 0)

  // Determine crowd density classification and high-contrast color palette
  let color = '#22c55e' // Vibrant emerald green for normal
  let bgBadge = 'rgba(34, 197, 94, 0.15)'
  let borderBadge = 'rgba(34, 197, 94, 0.3)'
  let statusText = 'Normal Capacity'
  let Icon = ShieldCheck

  if (val > 1100) {
    color = '#f97316' // High-contrast amber-orange for peak load
    bgBadge = 'rgba(249, 115, 22, 0.18)'
    borderBadge = 'rgba(249, 115, 22, 0.35)'
    statusText = 'Peak Surge'
    Icon = AlertTriangle
  } else if (val > 800) {
    color = '#eab308' // High-contrast warm gold/yellow for moderate load
    bgBadge = 'rgba(234, 179, 8, 0.18)'
    borderBadge = 'rgba(234, 179, 8, 0.35)'
    statusText = 'Moderate Density'
    Icon = TrendingUp
  }

  // Bar or Area name formatting
  const metricName = item.name === 'visitors' || item.name === 'visitor_count'
    ? 'Visitors'
    : item.name || 'Count'

  return (
    <div className="bg-slate-900/95 border border-slate-700/90 rounded-xl p-3.5 shadow-2xl backdrop-blur-md min-w-[150px] transition-all">
      {/* Day / Time Label */}
      <div className="flex items-center justify-between gap-3 mb-2 border-b border-slate-800 pb-1.5">
        <span className="text-xs font-bold text-slate-200 tracking-wide">
          {label}
        </span>
        <div
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1"
          style={{ backgroundColor: bgBadge, color, border: `1px solid ${borderBadge}` }}
        >
          <Icon size={10} />
          <span>{statusText}</span>
        </div>
      </div>

      {/* Main Metric Value with High-Contrast Themed Color */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Users size={12} className="text-slate-500" />
          {metricName}:
        </span>
        <span
          className="text-lg font-extrabold font-mono tracking-tight"
          style={{ color }}
        >
          {val.toLocaleString()}
        </span>
      </div>

      {/* Contextual baseline helper */}
      <div className="text-[10px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-slate-500">Threshold:</span>
        <span className="font-mono text-slate-300">
          {val > 1100 ? '> 1,100 peak' : val > 800 ? '800–1,100' : '< 800 normal'}
        </span>
      </div>
    </div>
  )
}
