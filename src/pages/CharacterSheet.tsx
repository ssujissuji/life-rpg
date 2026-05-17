import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import StatBar from '../components/StatBar'
import { getStatusTags } from '../lib/stats'
import type { Stats } from '../types'

interface StatConfig {
  icon: string
  label: string
  key: keyof Stats
}

interface SkillConfig {
  icon: string
  label: string
  key: 'pig' | 'poor' | 'cafe' | 'sleep'
  max: number
  unit: string
}

const STATS: StatConfig[] = [
  { icon: '❤️', label: '체력', key: 'hp' },
  { icon: '🧠', label: '집중력', key: 'focus' },
  { icon: '💬', label: '사회성', key: 'social' },
  { icon: '💸', label: '지갑', key: 'wallet' },
  { icon: '🚪', label: '외출의지', key: 'outdoor' },
  { icon: '😴', label: '수면질', key: 'sleepQ' },
]

const SKILLS: SkillConfig[] = [
  { icon: '🐷', label: '돼지력', key: 'pig', max: 50, unit: '회' },
  { icon: '🪙', label: '거지력', key: 'poor', max: 30, unit: '일' },
  { icon: '☕', label: '각성력', key: 'cafe', max: 100, unit: '회' },
  { icon: '🛌', label: '숙면력', key: 'sleep', max: 30, unit: '회' },
]

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear
}

function getLevelProgress(birthYear: number): number {
  const birth = new Date(birthYear, 0, 1)
  const now = new Date()
  const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday <= now) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  return Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function CharacterSheet() {
  const navigate = useNavigate()
  const { character, patches, skills } = useStore()

  const todayPatch = patches[today()]

  const recentEntries = Object.values(patches)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7)

  const avgStats: Stats | null =
    recentEntries.length > 0
      ? STATS.reduce((acc, s) => {
          acc[s.key] = Math.round(
            recentEntries.reduce((sum, e) => sum + (e.stats?.[s.key] ?? 0), 0) /
              recentEntries.length
          )
          return acc
        }, {} as Stats)
      : null

  const tags = todayPatch
    ? getStatusTags({
        sleep: todayPatch.sleep,
        cafeCount: todayPatch.cafe,
        spend: todayPatch.spend,
        deliveryCount: todayPatch.delivery,
        isMonday: new Date().getDay() === 1,
        isWeekend: [0, 6].includes(new Date().getDay()),
      })
    : []

  const age = getAge(character.birthYear)
  const daysLeft = getLevelProgress(character.birthYear)

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      <div className="text-text-sub text-xs font-mono">
        현생 RPG v{today().replace(/-/g, '.')}
      </div>

      {/* 캐릭터 프로필 */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white font-mono font-bold text-base">{character.name}</div>
            <div className="text-text-sub text-xs font-mono">{character.class}</div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="text-text-sub text-xs font-mono hover:text-purple-light transition-colors"
          >
            설정 →
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="text-purple-light">Lv.</span>
            <span className="text-white font-bold">{age}</span>
            <span className="text-text-sub text-xs">다음 레벨까지 {daysLeft}일</span>
          </div>
          <div className="w-full bg-bg-input rounded-full h-1.5">
            <div
              className="bg-purple-primary h-1.5 rounded-full transition-all"
              style={{ width: `${((365 - daysLeft) / 365) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 오늘의 상태 태그 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-bg-input text-purple-light border border-border font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 기본 스탯 */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="text-purple-light text-xs font-mono font-bold">
          기본 스탯
          <span className="text-text-sub font-normal ml-2">
            {recentEntries.length > 0 ? `최근 ${recentEntries.length}일 평균` : '기록 없음'}
          </span>
        </div>
        {avgStats ? (
          <div className="space-y-2">
            {STATS.map((s) => (
              <StatBar key={s.key} icon={s.icon} label={s.label} value={avgStats[s.key]} />
            ))}
          </div>
        ) : (
          <div className="text-text-sub text-xs font-mono py-2">
            패치노트를 작성하면 스탯이 쌓입니다.
          </div>
        )}
      </div>

      {/* 특수스킬 */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="text-purple-light text-xs font-mono font-bold">특수스킬</div>
        <div className="space-y-3">
          {SKILLS.map((sk) => {
            const data = skills[sk.key]
            const pct = Math.min(data.count / sk.max, 1)
            const filled = Math.round(pct * 10)
            const toMax = Math.max(0, sk.max - data.count)
            return (
              <div key={sk.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span>{sk.icon}</span>
                    <span className="text-purple-light">{sk.label}</span>
                    <span className="text-white">Lv.{data.level}</span>
                  </div>
                  <span className="text-text-sub">
                    {toMax > 0 ? `만렙까지 ${toMax}${sk.unit}` : '🎉 만렙!'}
                  </span>
                </div>
                <div className="flex gap-px">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-sm ${i < filled ? 'bg-purple-primary' : 'bg-bg-input'}`}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 패치노트 작성 버튼 */}
      <button
        onClick={() => navigate('/daily')}
        className="w-full bg-purple-primary hover:bg-purple-dark text-white font-mono text-sm py-3 rounded-lg transition-colors"
      >
        {todayPatch ? '오늘 패치노트 수정하기' : '📋 오늘의 패치노트 작성'}
      </button>
    </div>
  )
}
