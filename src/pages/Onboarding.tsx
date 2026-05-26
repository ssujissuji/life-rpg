import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { setOnboardingDone } from '../lib/storage'
import { DEFAULT_BASELINE } from '../types'
import type { PersonalBaseline } from '../types'
import BaselineForm from '../components/BaselineForm'
import { CLASS_OPTIONS } from './Settings'

type Step = 1 | 2 | 3 | 4

export default function Onboarding() {
  const navigate = useNavigate()
  const { setCharacter, setBaseline } = useStore()

  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [cls, setCls] = useState('')
  const [customCls, setCustomCls] = useState('')
  const [birthYear, setBirthYear] = useState<number | ''>('')
  const [baseline, setBaselineLocal] = useState<PersonalBaseline>({ ...DEFAULT_BASELINE })

  const currentYear = new Date().getFullYear()

  const resolvedCls = CLASS_OPTIONS.includes(cls) ? cls : customCls

  const isStep1Valid = name.trim().length > 0
  const isStep2Valid = resolvedCls.trim().length > 0
  const isStep3Valid =
    birthYear !== '' && Number(birthYear) >= 1950 && Number(birthYear) <= currentYear

  function handleComplete(useDefault: boolean) {
    if (birthYear === '' || isNaN(Number(birthYear))) return
    setCharacter({ name: name.trim(), class: resolvedCls.trim(), birthYear: Number(birthYear) })
    setBaseline(useDefault ? { ...DEFAULT_BASELINE } : baseline)
    setOnboardingDone()
    navigate('/')
  }

  function goNext() {
    if (step < 4) setStep((s) => (s + 1) as Step)
  }

  function goPrev() {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  return (
    <div className="min-h-svh bg-[#0f0f13] flex flex-col font-mono">
      <div className="flex-1 flex flex-col w-full max-w-[430px] mx-auto px-4 pt-10 pb-8">
        {/* 스텝 인디케이터 */}
        <div className="flex justify-center gap-2 mb-10">
          {([1, 2, 3, 4] as Step[]).map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                s === step ? 'bg-[#534ab7]' : 'bg-[#2a2a3a]'
              }`}
            />
          ))}
        </div>

        {/* 스텝 콘텐츠 */}
        <div className="flex-1 flex flex-col">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-[#6b7280] text-[11px] font-mono uppercase tracking-widest">STEP 1 / 4</div>
                <div className="text-white font-bold text-xl font-mono">캐릭터명을 입력하세요</div>
                <div className="text-[#6b7280] text-[13px] font-mono">앱에서 사용할 이름입니다</div>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="이름 입력..."
                className="w-full bg-[#1e1e2e] border border-[#2a2a3a] text-white text-[13px] font-mono rounded-lg px-3 py-3 outline-none focus:ring-1 focus:ring-[#534ab7] focus:border-[#534ab7] transition-colors placeholder-[#6b7280]"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-[#6b7280] text-[11px] font-mono uppercase tracking-widest">STEP 2 / 4</div>
                <div className="text-white font-bold text-xl font-mono">클래스를 선택하세요</div>
                <div className="text-[#6b7280] text-[13px] font-mono">현재 직업 또는 상태</div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-1.5 flex-wrap">
                  {CLASS_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setCls(option)
                        setCustomCls('')
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                        cls === option
                          ? 'bg-[#534ab7] text-white'
                          : 'bg-[#1e1e2e] text-[#6b7280] hover:text-white hover:bg-[#2a2a3a]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customCls}
                  onChange={(e) => {
                    setCustomCls(e.target.value)
                    setCls('')
                  }}
                  placeholder="직접 입력..."
                  maxLength={10}
                  className="w-full bg-[#1e1e2e] border border-[#2a2a3a] text-white text-[13px] font-mono rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-[#534ab7] focus:border-[#534ab7] transition-colors placeholder-[#6b7280]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-[#6b7280] text-[11px] font-mono uppercase tracking-widest">STEP 3 / 4</div>
                <div className="text-white font-bold text-xl font-mono">출생연도를 입력하세요</div>
                <div className="text-[#6b7280] text-[13px] font-mono">레벨 계산에 사용됩니다</div>
              </div>
              <input
                type="number"
                value={birthYear}
                onChange={(e) =>
                  setBirthYear(e.target.value === '' ? '' : Number(e.target.value))
                }
                min={1950}
                max={currentYear}
                placeholder="예: 1995"
                className="w-full bg-[#1e1e2e] border border-[#2a2a3a] text-white text-[13px] font-mono rounded-lg px-3 py-3 outline-none focus:ring-1 focus:ring-[#534ab7] focus:border-[#534ab7] transition-colors placeholder-[#6b7280]"
                autoFocus
              />
              {birthYear !== '' &&
                (Number(birthYear) < 1950 || Number(birthYear) > currentYear) && (
                  <div className="text-[#f0997b] text-xs font-mono">
                    1950 ~ {currentYear} 사이의 연도를 입력하세요
                  </div>
                )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-[#6b7280] text-[11px] font-mono uppercase tracking-widest">STEP 4 / 4</div>
                <div className="text-white font-bold text-xl font-mono">개인 기준값 설정</div>
                <div className="text-[#6b7280] text-[13px] font-mono">능력치 계산 기준이 됩니다</div>
              </div>
              <div className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4">
                <BaselineForm value={baseline} onChange={setBaselineLocal} />
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-10 space-y-2">
          {step === 4 ? (
            <>
              <button
                type="button"
                onClick={() => handleComplete(false)}
                className="w-full bg-[#534ab7] hover:bg-purple-dark text-white font-mono text-sm py-3 rounded-lg transition-colors"
              >
                시작하기
              </button>
              <button
                type="button"
                onClick={() => handleComplete(true)}
                className="w-full text-[#6b7280] font-mono text-[13px] py-2.5 hover:text-[#afa9ec] transition-colors"
              >
                건너뛰기 (기본값 사용)
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid)
              }
              className="w-full bg-[#534ab7] hover:bg-purple-dark text-white font-mono text-sm py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          )}
          {step > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="w-full text-[#6b7280] font-mono text-[13px] py-2.5 hover:text-white transition-colors"
            >
              이전
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
