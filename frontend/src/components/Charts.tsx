import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import type { ZoneFlowResult } from '../types/api'

interface VisitorTimeSeriesProps {
  data: Array<{ time: string; visitors: number; capacity: number }>
}

export function VisitorTimeSeries({ data }: VisitorTimeSeriesProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c17f3c" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#c17f3c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#57606a' }} />
        <YAxis tick={{ fontSize: 11, fill: '#57606a' }} />
        <Tooltip
          contentStyle={{ fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 6 }}
          formatter={(v: number) => [v, 'Visitors']}
        />
        <Area type="monotone" dataKey="visitors" stroke="#c17f3c" strokeWidth={2} fill="url(#visitorGradient)" />
        <Area type="monotone" dataKey="capacity" stroke="#e5e7eb" strokeWidth={1} fill="none" strokeDasharray="4 4" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface ZoneBarChartProps { zones: ZoneFlowResult[] }

const ZONE_COLORS: Record<string, string> = {
  LOW: '#16a34a',
  MODERATE: '#d97706',
  HIGH: '#ea580c',
  CRITICAL: '#dc2626',
}

export function ZoneBarChart({ zones }: ZoneBarChartProps) {
  const data = zones.map(z => ({
    name: z.zone_name.split('(')[0].trim(),
    occupancy: z.occupancy_percent,
    pressure: z.pressure,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#57606a' }} />
        <YAxis tick={{ fontSize: 11, fill: '#57606a' }} domain={[0, 100]} unit="%" />
        <Tooltip
          contentStyle={{ fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 6 }}
          formatter={(v: number) => [v.toFixed(1) + '%', 'Occupancy']}
        />
        <Bar dataKey="occupancy" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={ZONE_COLORS[entry.pressure] || '#c17f3c'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
