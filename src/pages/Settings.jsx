import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

const CLASS_OPTIONS = ['취준생', '직장인', '프리랜서', '학생', '백수', '사회인']

export default function Settings() {
  const navigate = useNavigate()
  const { character, setCharacter } = useStore()

  const [form, setForm] = useState({ ...character })
  const [saved, setSaved] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function handleSave(e) {
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
          className="text-[#6b7280] text-xs font-mono hover:text-[#afa9ec] transition-colors"
        >
          ← 뒤로
        </button>
        <div className="text-white font-mono font-bold text-base">설정</div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4 space-y-4">
          <div className="text-[#afa9ec] text-xs font-mono font-bold">캐릭터 정보</div>

          <div className="space-y-1.5">
            <label className="text-[#6b7280] text-xs font-mono">캐릭터명</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              maxLength={20}
              className="w-full bg-[#1e1e2e] text-white text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#534ab7] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#6b7280] text-xs font-mono">클래스</label>
            <div className="flex gap-1.5 flex-wrap">
              {CLASS_OPTIONS.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, class: cls }))}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    form.class === cls
                      ? 'bg-[#534ab7] text-white'
                      : 'bg-[#1e1e2e] text-[#6b7280] hover:text-white'
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
              className="w-full bg-[#1e1e2e] text-white text-sm font-mono rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-[#534ab7] transition-all placeholder-[#6b7280]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#6b7280] text-xs font-mono">출생연도 (레벨 계산용)</label>
            <input
              type="number"
              value={form.birthYear}
              onChange={set('birthYear')}
              min={1950}
              max={new Date().getFullYear()}
              className="w-full bg-[#1e1e2e] text-white text-sm font-mono rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#534ab7] transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#534ab7] hover:bg-[#4340a0] text-white font-mono text-sm py-3 rounded-lg transition-colors"
        >
          {saved ? '✓ 저장됨' : '저장하기'}
        </button>
      </form>
    </div>
  )
}
