import { useNavigate } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import useStore from '../store/useStore'
import { setHasLanded } from '../lib/storage'
import Panel from '../components/Panel'

export default function Landing() {
  const navigate = useNavigate()
  const character = useStore((s) => s.character)
  const patches = useStore((s) => s.patches)

  const level = new Date().getFullYear() - character.birthYear
  const patchCount = Object.keys(patches).length

  function handleLogin() {
    setHasLanded()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-svh bg-bg-root flex flex-col items-center justify-center font-mono">
      <div className="w-full max-w-[430px] px-4 flex flex-col items-center gap-8">
        <p className="t-h1 t-glow-gold text-[22px] tracking-widest" style={{ color: 'var(--color-gold)' }}>현생 RPG</p>
        <Panel className="w-full p-6">
          <TypeAnimation
            sequence={[
              '> LOADING SAVE DATA...',
              900,
              `> LOADING SAVE DATA...\n> PLAYER FOUND: ${character.name} (LV.${level}) — 기록 ${patchCount}개 확인`,
              800,
              `> LOADING SAVE DATA...\n> PLAYER FOUND: ${character.name} (LV.${level}) — 기록 ${patchCount}개 확인\n> PRESS [Y] TO CONTINUE`,
              500,
            ]}
            wrapper="div"
            speed={65}
            cursor={true}
            repeat={0}
            className="text-purple-light text-[13px] font-mono min-h-[72px] whitespace-pre-wrap"
          />
        </Panel>
        <div className="w-full">
          <button
            type="button"
            onClick={handleLogin}
            className="t-btn-primary"
          >
            [Y] 현생 로그인
          </button>
        </div>
      </div>
    </div>
  )
}
