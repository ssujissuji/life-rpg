import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { StatChartPoint } from '../types'

export const STAT_TREND_COLORS = {
  hp: '#f0997b',
  focus: '#afa9ec',
  wallet: '#5dcaa5',
}

interface StatTrendChartProps {
  data: StatChartPoint[]
}

export default function StatTrendChart({ data }: StatTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis domain={[0, 100]} hide />
        <Tooltip
          contentStyle={{
            background: '#1e1e2e',
            border: '1px solid #2a2a3a',
            borderRadius: 6,
            fontFamily: 'monospace',
            fontSize: 12,
          }}
          labelStyle={{ color: '#afa9ec' }}
          itemStyle={{ color: '#e2e8f0' }}
        />
        <Line
          type="monotone"
          dataKey="hp"
          stroke="#f0997b"
          strokeWidth={2}
          dot={false}
          name="체력"
        />
        <Line
          type="monotone"
          dataKey="focus"
          stroke="#afa9ec"
          strokeWidth={2}
          dot={false}
          name="집중력"
        />
        <Line
          type="monotone"
          dataKey="wallet"
          stroke="#5dcaa5"
          strokeWidth={2}
          dot={false}
          name="지갑"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
