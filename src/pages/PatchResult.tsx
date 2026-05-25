import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import StatBar from '../components/StatBar'
import Toast from '../components/Toast'
import { getStatusTags, formatSpend } from '../lib/stats'
import { loadMaxedSkills, saveMaxedSkills } from '../lib/storage'
import type { Skills, Stats } from '../types'

interface StatConfig {
  icon: string
  label: string
  key: keyof Stats
}

const STATS: StatConfig[] = [
  { icon: '❤️', label: '체력', key: 'hp' },
  { icon: '🧠', label: '집중력', key: 'focus' },
  { icon: '💬', label: '사회성', key: 'social' },
  { icon: '💸', label: '지갑', key: 'wallet' },
  { icon: '🚪', label: '외출의지', key: 'outdoor' },
  { icon: '😴', label: '수면질', key: 'sleepQ' },
]

const ENCOURAGEMENTS = [
  '오늘도 어떻게든 버텼다. 수고했어.',
  '살아있다는 것만으로도 오늘은 성공이다.',
  '내일의 나는 오늘의 나보다 강하다.',
  '현생은 어렵지만, 넌 더 어렵다.',
  '오늘 하루도 클리어. 경험치 +1.',
  '버그 투성이 현실에서도 넌 잘 버텼다.',
]

const MEAL_LABELS = ['0끼', '1끼', '2끼', '3끼', '3끼+']

interface SkillToast {
  message: string
  subMessage: string
}

const SKILL_META: Record<keyof Skills, { icon: string; label: string; title: string }> = {
  pig: { icon: '🐷', label: '돼지력', title: '칭호 언락: 진정한 돼지왕' },
  poor: { icon: '🪙', label: '거지력', title: '칭호 언락: 절약의 신' },
  cafe: { icon: '☕', label: '각성력', title: '칭호 언락: 카페인 마스터' },
  sleep: { icon: '🛌', label: '숙면력', title: '칭호 언락: 꿀잠의 전설' },
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return `v${dateStr.replace(/-/g, '.')} (${days[d.getDay()]})`
}

export default function PatchResult() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { getPatch } = useStore()

  const fromSave = !!(location.state as { fromSave?: boolean } | null)?.fromSave

  const newlyMaxed = useMemo<(keyof Skills)[]>(() => {
    if (!fromSave) return []
    const { skills } = useStore.getState()
    const prevMaxed = new Set(loadMaxedSkills())
    return (Object.keys(SKILL_META) as (keyof Skills)[]).filter(
      (key) => skills[key].level >= 10 && !prevMaxed.has(key),
    )
  }, [fromSave])

  const [toastQueue, setToastQueue] = useState<SkillToast[]>(() =>
    newlyMaxed.map((key) => {
      const meta = SKILL_META[key]
      return { message: `${meta.icon} ${meta.label} — 만렙 달성!`, subMessage: meta.title }
    }),
  )

  useEffect(() => {
    if (newlyMaxed.length === 0) return
    const prevMaxed = loadMaxedSkills()
    saveMaxedSkills([...new Set([...prevMaxed, ...newlyMaxed])])
  }, [newlyMaxed])

  const currentToast = toastQueue[0] ?? null
  const handleToastClose = useCallback(() => setToastQueue((prev) => prev.slice(1)), [])

  const patch = date ? getPatch(date) : null

  if (!patch || !date) {
    return (
      <div className="px-4 pt-6 pb-28 text-center space-y-4">
        <div className="text-text-sub font-mono text-sm">해당 날짜의 기록이 없습니다.</div>
        <button
          onClick={() => navigate('/daily')}
          className="bg-purple-primary text-white font-mono text-sm px-4 py-2 rounded-lg"
        >
          패치노트 작성하기
        </button>
      </div>
    )
  }

  const tags = getStatusTags({
    sleep: patch.sleep,
    cafeCount: patch.cafe,
    spend: patch.spend,
    deliveryCount: patch.delivery,
    isMonday: new Date(date + 'T00:00:00').getDay() === 1,
    isWeekend: [0, 6].includes(new Date(date + 'T00:00:00').getDay()),
  })

  const encouragement =
    ENCOURAGEMENTS[Math.floor(new Date(date).getDate() % ENCOURAGEMENTS.length)]

  const statusSummary = tags.length > 0 ? tags.join(' / ') : '평온한 하루'

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      {currentToast && (
        <Toast
          message={currentToast.message}
          subMessage={currentToast.subMessage}
          onClose={handleToastClose}
        />
      )}
      <div className="space-y-1">
        <button
          onClick={() => navigate('/')}
          className="text-text-sub text-xs font-mono hover:text-purple-light transition-colors"
        >
          ← 홈으로
        </button>
      </div>

      {/* 결과 카드 */}
      <div className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-mono font-bold text-sm">
              📋 {formatDateLabel(date)}
            </span>
            <span className="text-xl">{patch.emoji}</span>
          </div>
          <div className="text-text-sub text-xs font-mono">상태: {statusSummary}</div>
        </div>

        <div className="border-t border-border" />

        {/* 능력치 */}
        <div className="space-y-2">
          <div className="text-purple-light text-xs font-mono font-bold">[능력치 변화]</div>
          {STATS.map((s) => (
            <StatBar key={s.key} icon={s.icon} label={s.label} value={patch.stats[s.key]} />
          ))}
        </div>

        {/* 태그 */}
        {tags.length > 0 && (
          <>
            <div className="border-t border-border" />
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
          </>
        )}

        {/* 메모 */}
        {patch.memo && (
          <>
            <div className="border-t border-border" />
            <div className="text-text-base text-xs font-mono italic">"{patch.memo}"</div>
          </>
        )}

        <div className="border-t border-border" />

        <div className="text-success text-xs font-mono text-center py-1">
          "{encouragement}"
        </div>
      </div>

      {/* 기록 요약 */}
      <div className="bg-bg-card border border-border rounded-lg p-4">
        <div className="text-purple-light text-xs font-mono font-bold mb-3">[오늘의 기록]</div>
        <div className="grid grid-cols-2 gap-y-2 text-xs font-mono">
          <span className="text-text-sub">수면</span>
          <span className="text-white">{patch.sleep}시간</span>
          <span className="text-text-sub">식사</span>
          <span className="text-white">{MEAL_LABELS[patch.meal]}</span>
          <span className="text-text-sub">카페</span>
          <span className="text-white">{patch.cafe}회</span>
          <span className="text-text-sub">배달</span>
          <span className="text-white">{patch.delivery}회</span>
          <span className="text-text-sub">지출</span>
          <span className="text-white">{formatSpend(patch.spend)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/daily')}
        className="w-full border border-border text-purple-light font-mono text-sm py-3 rounded-lg hover:bg-bg-card transition-colors"
      >
        수정하기
      </button>
    </div>
  )
}
