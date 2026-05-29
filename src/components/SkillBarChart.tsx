import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  Cell,
} from 'recharts'
import type { Skills } from '../types'
import { SKILL_COLORS, SKILL_COLORS_DIM } from '../lib/skills'

interface SkillBarChartProps {
  skills: Skills
}

export default function SkillBarChart({ skills }: SkillBarChartProps) {
  const data = [
    { name: '돼지력', level: skills.pig.level, key: 'pig' as const },
    { name: '거지력', level: skills.poor.level, key: 'poor' as const },
    { name: '각성력', level: skills.cafe.level, key: 'cafe' as const },
    { name: '숙면력', level: skills.sleep.level, key: 'sleep' as const },
  ]

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: -20 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis domain={[0, 10]} hide />
        <Bar dataKey="level" radius={[2, 2, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill={entry.level >= 10 ? SKILL_COLORS[entry.key] : SKILL_COLORS_DIM[entry.key]}
            />
          ))}
          <LabelList
            dataKey="level"
            position="top"
            fill="#afa9ec"
            fontSize={10}
            fontFamily="monospace"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
