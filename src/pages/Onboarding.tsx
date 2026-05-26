import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { DEFAULT_BASELINE } from '../types'
import type { PersonalBaseline, SidoName } from '../types'
import BaselineForm from '../components/BaselineForm'
import SidoPicker from '../components/SidoPicker'
import { CLASS_OPTIONS } from './Settings'

type Step = 1 | 2 | 3 | 4 | 5

export default function Onboarding() {
  const navigate = useNavigate()
  const { setCharacter, setBaseline, completeOnboarding } = useStore()

  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [cls, setCls] = useState('')
  const [customCls, setCustomCls] = useState('')
  const [birthYear, setBirthYear] = useState<number | ''>('')
  const [region, setRegionLocal] = useState<SidoName | null>(null)
  const [baseline, setBaselineLocal] = useState<PersonalBaseline>({ ...DEFAULT_BASELINE })

  const currentYear = new Date().getFullYear()

  const resolvedCls = CLASS_OPTIONS.includes(cls) ? cls : customCls

  const isStep1Valid = name.trim().length > 0
  const isStep2Valid = resolvedCls.trim().length > 0
  const isStep3Valid =
    birthYear !== '' && Number(birthYear) >= 1950 && Number(birthYear) <= currentYear
  function handleComplete(useDefault: boolean) {
    if (birthYear === '' || isNaN(Number(birthYear))) return
    setCharacter({ name: name.trim(), class: resolvedCls.trim(), birthYear: Number(birthYear), region: region ?? undefined })
    setBaseline(useDefault ? { ...DEFAULT_BASELINE } : baseline)
    completeOnboarding()
    navigate('/')
  }

  function goNext() {
    if (step < 5) setStep((s) => (s + 1) as Step)
  }

  function goPrev() {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  return (
    <div className="min-h-svh bg-bg-root flex flex-col font-mono">
      <div className="flex-1 flex flex-col w-full max-w-[430px] mx-auto px-4 pt-10 pb-8">
        <div className="flex justify-center gap-2 mb-10">
          {([1, 2, 3, 4, 5] as Step[]).map((s) => (
            <div
              key={s}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                s === step ? 'bg-purple-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-text-sub text-[11px] font-mono uppercase tracking-widest">STEP 1 / 5</div>
                <div className="text-white font-bold text-xl font-mono">캐릭터명을 입력하세요</div>
                <div className="text-text-sub text-[13px] font-mono">앱에서 사용할 이름입니다</div>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="이름 입력..."
                className="w-full bg-bg-input border border-border text-white text-[13px] font-mono rounded-lg px-3 py-3 outline-none focus:ring-1 focus:ring-purple-primary focus:border-purple-primary transition-colors placeholder-text-sub"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-text-sub text-[11px] font-mono uppercase tracking-widest">STEP 2 / 5</div>
                <div className="text-white font-bold text-xl font-mono">클래스를 선택하세요</div>
                <div className="text-text-sub text-[13px] font-mono">현재 직업 또는 상태</div>
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
                          ? 'bg-purple-primary text-white'
                          : 'bg-bg-input text-text-sub hover:text-white hover:bg-border'
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
                  className="w-full bg-bg-input border border-border text-white text-[13px] font-mono rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-purple-primary focus:border-purple-primary transition-colors placeholder-text-sub"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-text-sub text-[11px] font-mono uppercase tracking-widest">STEP 3 / 5</div>
                <div className="text-white font-bold text-xl font-mono">출생연도를 입력하세요</div>
                <div className="text-text-sub text-[13px] font-mono">레벨 계산에 사용됩니다</div>
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
                className="w-full bg-bg-input border border-border text-white text-[13px] font-mono rounded-lg px-3 py-3 outline-none focus:ring-1 focus:ring-purple-primary focus:border-purple-primary transition-colors placeholder-text-sub"
                autoFocus
              />
              {birthYear !== '' &&
                (Number(birthYear) < 1950 || Number(birthYear) > currentYear) && (
                  <div className="text-danger text-xs font-mono">
                    1950 ~ {currentYear} 사이의 연도를 입력하세요
                  </div>
                )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-text-sub text-[11px] font-mono uppercase tracking-widest">STEP 4 / 5</div>
                <div className="text-white font-bold text-xl font-mono">지역을 선택하세요</div>
                <div className="text-text-sub text-[13px] font-mono">날씨 및 공기질 데이터에 사용됩니다</div>
              </div>
              <SidoPicker value={region} onChange={setRegionLocal} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-text-sub text-[11px] font-mono uppercase tracking-widest">STEP 5 / 5</div>
                <div className="text-white font-bold text-xl font-mono">개인 기준값 설정</div>
                <div className="text-text-sub text-[13px] font-mono">능력치 계산 기준이 됩니다</div>
              </div>
              <div className="bg-bg-card border border-border rounded-lg p-4">
                <BaselineForm value={baseline} onChange={setBaselineLocal} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 space-y-2">
          {step === 5 ? (
            <>
              <button
                type="button"
                onClick={() => handleComplete(false)}
                className="w-full bg-purple-primary hover:bg-purple-dark text-white font-mono text-sm py-3 rounded-lg transition-colors"
              >
                시작하기
              </button>
              <button
                type="button"
                onClick={() => handleComplete(true)}
                className="w-full text-text-sub font-mono text-[13px] py-2.5 hover:text-purple-light transition-colors"
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
                (step === 3 && !isStep3Valid) ||
                false
              }
              className="w-full bg-purple-primary hover:bg-purple-dark text-white font-mono text-sm py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          )}
          {step > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="w-full text-text-sub font-mono text-[13px] py-2.5 hover:text-white transition-colors"
            >
              이전
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
