import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { House } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import StatBar from '../components/StatBar';
import Toast from '../components/Toast';
import Panel from '../components/Panel';
import BuffTag, { classifyTag } from '../components/BuffTag';
import { formatSpend } from '../lib/stats';
import { formatDateLabel } from '../lib/date';
import { loadPatch } from '../lib/storage';
import { TITLE_DEFS, checkTitleUnlocks } from '../lib/titles';
import type { Skills, StatConfig } from '../types';

const STATS: StatConfig[] = [
  { icon: '❤️', label: '체력', key: 'hp' },
  { icon: '🧠', label: '집중력', key: 'focus' },
  { icon: '💬', label: '사회성', key: 'social' },
  { icon: '💸', label: '지갑', key: 'wallet' },
  { icon: '🚪', label: '외출의지', key: 'outdoor' },
  { icon: '😴', label: '수면질', key: 'sleepQ' },
];

const ENCOURAGEMENTS = [
  '오늘도 어떻게든 버텼다. 수고했어.',
  '살아있다는 것만으로도 오늘은 성공이다.',
  '내일의 나는 오늘의 나보다 강하다.',
  '현생은 어렵지만, 넌 더 어렵다.',
  '오늘 하루도 클리어. 경험치 +1.',
  '버그 투성이 현실에서도 넌 잘 버텼다.',
];

const MEAL_LABELS = ['0끼', '1끼', '2끼', '3끼', '3끼+'];

interface SkillToast {
  message: string;
  subMessage: string;
  kind?: 'rare' | 'system';
}

const SKILL_META: Record<
  keyof Skills,
  { icon: string; label: string; title: string }
> = {
  pig: { icon: '🐷', label: '돼지력', title: '칭호 언락: 진정한 돼지왕' },
  poor: { icon: '🪙', label: '거지력', title: '칭호 언락: 절약의 신' },
  cafe: { icon: '☕', label: '각성력', title: '칭호 언락: 카페인 마스터' },
  sleep: { icon: '🛌', label: '숙면력', title: '칭호 언락: 꿀잠의 전설' },
};

/** "2026-05-21" → "v2026.05.21" */
function versionTag(date: string): string {
  return `v${date.replace(/-/g, '.')}`;
}

/** "2026-05-21" → "목요일" (요일만) */
function weekdayOnly(date: string): string {
  const label = formatDateLabel(date);
  const m = label.match(/[월화수목금토일]요일/);
  return m ? m[0] : label;
}

export default function PatchResult() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const maxedSkills = useStore((s) => s.maxedSkills);
  const skills = useStore((s) => s.skills);
  const patches = useStore((s) => s.patches);
  const unlockedTitles = useStore((s) => s.unlockedTitles);
  const { getPatch, markSkillsMaxed, markTitlesUnlocked } = useStore();

  const fromSave = !!(location.state as { fromSave?: boolean } | null)
    ?.fromSave;

  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const newlyMaxed = useMemo<(keyof Skills)[]>(() => {
    if (!fromSave) return [];
    const prevMaxed = new Set(maxedSkills);
    return (Object.keys(SKILL_META) as (keyof Skills)[]).filter(
      (key) => skills[key].level >= 10 && !prevMaxed.has(key),
    );
  }, [fromSave, skills, maxedSkills]);

  const updatedMaxedSkills = useMemo(
    () => [...new Set([...maxedSkills, ...newlyMaxed])],
    [maxedSkills, newlyMaxed],
  );

  const newlyUnlockedTitles = useMemo<string[]>(() => {
    if (!fromSave) return [];
    const allUnlocked = checkTitleUnlocks(patches, updatedMaxedSkills);
    return allUnlocked.filter((id) => !unlockedTitles.includes(id));
  }, [fromSave, patches, updatedMaxedSkills, unlockedTitles]);

  const [toastQueue, setToastQueue] = useState<SkillToast[]>(() => {
    const skillToasts = newlyMaxed.map((key) => {
      const meta = SKILL_META[key];
      return {
        message: `${meta.icon} ${meta.label} — 만렙 달성!`,
        subMessage: meta.title,
        kind: 'rare' as const,
      };
    });

    if (!fromSave) return skillToasts;

    const currentMaxed = [...new Set([...maxedSkills, ...newlyMaxed])];
    const allUnlocked = checkTitleUnlocks(patches, currentMaxed);
    const newTitleIds = allUnlocked.filter((id) => !unlockedTitles.includes(id));

    const titleToasts = newTitleIds.map((id) => {
      const def = TITLE_DEFS.find((t) => t.id === id)!;
      return {
        message: `${def.icon} 칭호 획득!`,
        subMessage: def.label,
        kind: 'rare' as const,
      };
    });

    return [...skillToasts, ...titleToasts];
  });

  const handleShare = useCallback(async () => {
    if (!cardRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: '#0e0e16',
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `patch-${date}.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: '오늘의 현생 패치노트' });
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `patch-${date}.png`;
        a.click();
      }
    } catch {
      setToastQueue((prev) => [
        ...prev,
        { message: '🖼️ 저장 실패', subMessage: '다시 시도해주세요.' },
      ]);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, date]);

  useEffect(() => {
    if (newlyMaxed.length === 0) return;
    markSkillsMaxed(newlyMaxed);
  }, [newlyMaxed, markSkillsMaxed]);

  useEffect(() => {
    if (newlyUnlockedTitles.length === 0) return;
    markTitlesUnlocked(newlyUnlockedTitles);
  }, [newlyUnlockedTitles, markTitlesUnlocked]);

  const currentToast = toastQueue[0] ?? null;
  const handleToastClose = useCallback(
    () => setToastQueue((prev) => prev.slice(1)),
    [setToastQueue],
  );

  const patch = date ? getPatch(date) : null;

  const prevPatch = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    const prevDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return loadPatch(prevDate);
  }, [date]);

  /** "생존 +N" — 누적 패치노트 갯수 */
  const survivalCount = useMemo(() => Object.keys(patches).length, [patches]);

  if (!patch || !date) {
    return (
      <div className="px-4 pt-6 pb-28 text-center space-y-4">
        <div className="text-text-sub font-mono text-sm">
          해당 날짜의 기록이 없습니다.
        </div>
        <button onClick={() => navigate('/daily')} className="t-btn-primary">
          패치노트 작성하기
        </button>
      </div>
    );
  }

  const tags = patch.tags;

  const encouragement =
    ENCOURAGEMENTS[
      Math.floor(new Date(date).getDate() % ENCOURAGEMENTS.length)
    ];

  const statusSummary = tags.length > 0 ? tags.join(' / ') : '평온한 하루';

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      {currentToast && (
        <Toast
          message={currentToast.message}
          subMessage={currentToast.subMessage}
          onClose={handleToastClose}
          kind={currentToast.kind}
        />
      )}

      {/* 상단 — Home + breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-text-sub hover:text-purple-light transition-colors"
          aria-label="홈">
          <House size={16} />
        </button>
        <div className="text-text-sub text-[10px] font-mono tracking-[0.18em] uppercase">
          {'> 패치 적용 완료'}
        </div>
      </div>

      {/* 결과 카드 */}
      <div ref={cardRef}>
        <Panel className="p-4 pt-6 space-y-4 relative">
          <span className="t-panel-label">
            [ PATCH NOTE · {versionTag(date)} ]
          </span>

          {/* 타이틀 행 */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="t-h1 t-glow text-white text-[18px]">
                {weekdayOnly(date)}
              </div>
              <div className="text-text-sub text-[11px] font-mono">
                상태: {statusSummary}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-[26px] leading-none">{patch.emoji}</div>
              <button
                type="button"
                onClick={handleShare}
                disabled={isCapturing}
                className="text-text-sub hover:text-purple-light transition-colors text-base disabled:opacity-50"
                aria-label="공유">
                📤
              </button>
            </div>
          </div>

          <hr className="t-divider" />

          {/* 능력치 */}
          <div className="space-y-2">
            <div className="t-label">◢ 능력치 변화</div>
            <div className="space-y-2">
              {STATS.map((s) => (
                <StatBar
                  key={s.key}
                  icon={s.icon}
                  label={s.label}
                  value={patch.stats[s.key]}
                  delta={
                    prevPatch
                      ? patch.stats[s.key] - prevPatch.stats[s.key]
                      : undefined
                  }
                />
              ))}
            </div>
          </div>

          {/* 태그 */}
          {tags.length > 0 && (
            <>
              <hr className="t-divider" />
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <BuffTag key={tag} label={tag} type={classifyTag(tag)} />
                ))}
              </div>
            </>
          )}

          {/* 메모 */}
          {patch.memo && (
            <>
              <hr className="t-divider" />
              <div className="text-text-base text-xs font-mono italic">
                "{patch.memo}"
              </div>
            </>
          )}

          <hr className="t-divider" />

          {/* 격려 + 생존 카운터 */}
          <div className="space-y-2">
            <div className="text-text-base text-xs font-mono italic text-center">
              "{encouragement}"
            </div>
            <div className="text-success font-mono text-[11px] text-center tracking-[0.18em] t-glow">
              {`>>> 생존 +${survivalCount} <<<`}
            </div>
          </div>
        </Panel>
      </div>

      {/* 기록 요약 */}
      <Panel className="p-4 relative">
        <div className="t-label mb-3">◢ 오늘의 기록</div>
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
          <span
            className={
              patch.spend > 30000 ? 'text-danger t-glow' : 'text-white'
            }>
            {formatSpend(patch.spend)}
          </span>
        </div>
      </Panel>

      {/* 수정하기 — ghost */}
      <button
        onClick={() => navigate(`/daily/${date}`)}
        className="t-btn-ghost">
        [ ESC ] 수정하기
      </button>
    </div>
  );
}
