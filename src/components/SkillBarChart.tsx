import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts'
import type { Skills } from '../types'

interface SkillBarChartProps {
  skills: Skills
}

export default function SkillBarChart({ skills }: SkillBarChartProps) {
  const data = [
    { name: '돼지력', level: skills.pig.level },
    { name: '거지력', level: skills.poor.level },
    { name: '각성력', level: skills.cafe.level },
    { name: '숙면력', level: skills.sleep.level },
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
        <Bar dataKey="level" fill="#534ab7" radius={[2, 2, 0, 0]}>
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
