import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import type { Character } from '../types'

const CLASS_OPTIONS = ['취준생', '직장인', '프리랜서', '학생', '백수', '사회인']

export default function Settings() {
  const navigate = useNavigate()
  const { character, setCharacter } = useStore()

  const [form, setForm] = useState<Character>({ ...character })
  const [saved, setSaved] = useState(false)

  const set =
    (key: keyof Character) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setCharacter({ ...form, birthYear: Number(form.birthYear) })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="px-4 pt-6 pb-28 space-y-5">
      <div className="space-y-1">
        <button
          onClick={() => navigate('/')}
          className="text-text-sub text-xs font-mono hover:text-purple-light transition-colors"
        >
          ← 뒤로
        </button>
        <div className="text-white font-mono font-bold text-base">설정</div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="text-purple-light text-xs font-mono font-bold">캐릭터 정보</div>

          <div className="space-y-1.5">
            <label className="text-text-sub text-xs font-mono">캐릭터명</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              maxLength={20}
              className="w-full bg-bg-input text-white text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-purple-primary transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-text-sub text-xs font-mono">클래스</label>
            <div className="flex gap-1.5 flex-wrap">
              {CLASS_OPTIONS.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, class: cls }))}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    form.class === cls
                      ? 'bg-purple-primary text-white'
                      : 'bg-bg-input text-text-sub hover:text-white'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={CLASS_OPTIONS.includes(form.class) ? '' : form.class}
              onChange={set('class')}
              placeholder="직접 입력..."
              maxLength={10}
              className="w-full bg-bg-input text-white text-sm font-mono rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-purple-primary transition-all placeholder-text-sub"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-text-sub text-xs font-mono">출생연도 (레벨 계산용)</label>
            <input
              type="number"
              value={form.birthYear}
              onChange={set('birthYear')}
              min={1950}
              max={new Date().getFullYear()}
              className="w-full bg-bg-input text-white text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-purple-primary transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-primary hover:bg-purple-dark text-white font-mono text-sm py-3 rounded-lg transition-colors"
        >
          {saved ? '✓ 저장됨' : '저장하기'}
        </button>
      </form>
    </div>
  )
}
