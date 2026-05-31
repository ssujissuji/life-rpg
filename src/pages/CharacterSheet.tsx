import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import useStore from '../store/useStore';
import StatBar from '../components/StatBar';
import SkillModal from '../components/SkillModal';
import Panel from '../components/Panel';
import SkillBar from '../components/SkillBar';
import BuffTag, { classifyTag } from '../components/BuffTag';
import TitleSelectModal from '../components/TitleSelectModal';
import Toast from '../components/Toast';
import { TITLE_DEFS } from '../lib/titles';
import { SKILL_COLORS, SKILL_COLORS_DIM } from '../lib/skills';
import { today } from '../lib/date';
import type { SkillConfig, StatConfig, Stats } from '../types';

const STATS: StatConfig[] = [
  { icon: '❤️', label: '체력', key: 'hp' },
  { icon: '🧠', label: '집중력', key: 'focus' },
  { icon: '💬', label: '사회성', key: 'social' },
  { icon: '💸', label: '지갑', key: 'wallet' },
  { icon: '🚪', label: '외출의지', key: 'outdoor' },
  { icon: '😴', label: '수면질', key: 'sleepQ' },
];

const SKILLS: SkillConfig[] = [
  {
    icon: '🐷',
    label: '돼지력',
    key: 'pig',
    max: 50,
    unit: '회',
    description: '먹는 것만이 낙',
    condition: '배달/카페 소비 누적 50회',
  },
  {
    icon: '🪙',
    label: '거지력',
    key: 'poor',
    max: 30,
    unit: '일',
    description: '절약의 신',
    condition: '소비 0원 기록 30일 누적',
  },
  {
    icon: '☕',
    label: '각성력',
    key: 'cafe',
    max: 100,
    unit: '회',
    description: '커피 없이 못 삼',
    condition: '카페 방문 100회 누적',
  },
  {
    icon: '🛌',
    label: '숙면력',
    key: 'sleep',
    max: 30,
    unit: '회',
    description: '꿀잠 마스터',
    condition: '8시간 이상 수면 30회 누적',
  },
];

function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

function getLevelProgress(birthYear: number): number {
  const birth = new Date(birthYear, 0, 1);
  const now = new Date();
  const nextBirthday = new Date(
    now.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
  );
  if (nextBirthday <= now)
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  return Math.ceil(
    (nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export default function CharacterSheet() {
  const navigate = useNavigate();
  const { character, patches, skills } = useStore();
  const unlockedTitles = useStore((s) => s.unlockedTitles);
  const activeTitle = useStore((s) => s.activeTitle);
  const { setActiveTitle } = useStore();
  const [selectedSkill, setSelectedSkill] = useState<SkillConfig | null>(null);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeDef = TITLE_DEFS.find((t) => t.id === activeTitle) ?? null;

  const todayPatch = patches[today()];

  const recentEntries = Object.values(patches)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  const avgStats: Stats | null =
    recentEntries.length > 0
      ? STATS.reduce((acc, s) => {
          acc[s.key] = Math.round(
            recentEntries.reduce((sum, e) => sum + (e.stats?.[s.key] ?? 0), 0) /
              recentEntries.length,
          );
          return acc;
        }, {} as Stats)
      : null;

  const tags = todayPatch?.tags ?? [];

  const age = getAge(character.birthYear);
  const daysLeft = getLevelProgress(character.birthYear);
  const progressPct = ((365 - daysLeft) / 365) * 100;

  return (
    <div className="px-4 pt-6 pb-28 space-y-4">
      <div className="text-text-sub text-[10px] font-mono tracking-[0.18em] uppercase">
        {`> 현생 RPG · v${today().replace(/-/g, '.')}`}
      </div>

      {/* 캐릭터 프로필 */}
      <Panel className="p-4 relative">
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-3 right-3 text-text-sub hover:text-purple-light transition-colors"
          aria-label="설정">
          <Settings size={16} />
        </button>

        <div className="t-label text-[9px] mb-2">◢ 캐릭터</div>

        <div className="flex gap-3">
          {/* 캐릭터 이미지 자리 */}
          <div
            className="flex-none w-[72px] self-stretch flex flex-col items-center justify-center gap-1"
            style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-border)' }}
          >
            <span className="text-[22px] leading-none">◈</span>
            <span
              className="text-[8px] font-mono tracking-wider uppercase"
              style={{ color: 'var(--color-text-dim)' }}
            >
              no img
            </span>
          </div>

          {/* 캐릭터 정보 */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0 pr-5">
            <div className="t-h1 t-glow-soft text-white text-[18px] leading-tight truncate">
              {character.name}
            </div>

            <div className="flex items-end justify-between font-mono">
              <div className="flex items-baseline gap-1.5">
                <span className="text-purple-light text-xs">Lv.</span>
                <span
                  className="text-white text-[22px] leading-none"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                  {age}
                </span>
                <span className="text-text-sub text-[10px] font-mono">{character.class}</span>
              </div>
              <span className="text-text-sub text-[10px]">+{daysLeft}일</span>
            </div>

            <div
              className="w-full h-1.5 relative"
              style={{ background: 'var(--color-bg-input)' }}>
              <div
                className="h-1.5 transition-all"
                style={{
                  width: `${progressPct}%`,
                  background: 'var(--color-purple-glow)',
                  boxShadow: '0 0 8px var(--color-purple-glow)',
                }}
              />
            </div>

            {activeDef && (
              <button
                onClick={() => setShowTitleModal(true)}
                className={`w-full flex items-center gap-2 p-2 font-mono${activeDef.rarity === 'legendary' ? ' t-legendary-pulse' : ''}`}
                style={{
                  border: `1px solid ${activeDef.accentColor ?? (activeDef.rarity === 'legendary' ? 'var(--color-gold)' : activeDef.rarity === 'rare' ? 'var(--color-purple-glow)' : 'var(--color-border-strong)')}`,
                  background: activeDef.rarity === 'legendary' ? 'var(--color-gold-tint)' : activeDef.rarity === 'rare' ? 'var(--color-purple-tint)' : 'var(--color-bg-input)',
                  ...(activeDef.rarity === 'legendary' && activeDef.accentColor
                    ? ({ '--pulse-color': `${activeDef.accentColor}99` } as React.CSSProperties)
                    : {}),
                }}>
                <span className="text-sm w-5 text-center flex-shrink-0">{activeDef.icon}</span>
                <span
                  className="text-[11px] font-mono truncate"
                  style={{ color: activeDef.accentColor ?? (activeDef.rarity === 'legendary' ? 'var(--color-gold)' : activeDef.rarity === 'rare' ? 'var(--color-purple-light)' : 'var(--color-text-base)') }}>
                  {activeDef.label}
                </span>
                <span
                  className="ml-auto text-[9px] tracking-wider uppercase flex-shrink-0"
                  style={{ color: activeDef.accentColor ?? (activeDef.rarity === 'legendary' ? 'var(--color-gold)' : activeDef.rarity === 'rare' ? 'var(--color-purple-glow)' : 'var(--color-text-sub)') }}>
                  {activeDef.rarity}
                </span>
              </button>
            )}
          </div>
        </div>
      </Panel>

      {/* 오늘의 상태 태그 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <BuffTag key={tag} label={tag} type={classifyTag(tag)} />
          ))}
        </div>
      )}

      {/* 기본 스탯 */}
      <Panel className="p-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="t-label">◢ 기본 스탯</div>
          <div className="text-text-sub text-[10px] font-mono">
            {recentEntries.length > 0
              ? `최근 ${recentEntries.length}일 평균`
              : '기록 없음'}
          </div>
        </div>
        {avgStats ? (
          <div className="space-y-2">
            {STATS.map((s) => (
              <StatBar
                key={s.key}
                icon={s.icon}
                label={s.label}
                value={avgStats[s.key]}
              />
            ))}
          </div>
        ) : (
          <div className="text-text-sub text-xs font-mono py-2">
            패치노트를 작성하면 스탯이 쌓입니다.
          </div>
        )}
      </Panel>

      {/* 특수스킬 */}
      <Panel className="p-4 space-y-3">
        <div className="t-label">◢ 특수 스킬</div>
        <div className="space-y-3">
          {SKILLS.map((sk) => {
            const data = skills[sk.key];
            return (
              <button
                key={sk.key}
                className="w-full text-left"
                onClick={() => setSelectedSkill(sk)}>
                <SkillBar
                  icon={sk.icon}
                  label={sk.label}
                  level={data.level}
                  count={data.count}
                  max={sk.max}
                  unit={sk.unit}
                  color={SKILL_COLORS[sk.key]}
                  dimColor={SKILL_COLORS_DIM[sk.key]}
                />
              </button>
            );
          })}
        </div>
      </Panel>

      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          data={skills[selectedSkill.key]}
          onClose={() => setSelectedSkill(null)}
          color={SKILL_COLORS[selectedSkill.key]}
          dimColor={SKILL_COLORS_DIM[selectedSkill.key]}
        />
      )}

      {showTitleModal && (
        <TitleSelectModal
          unlockedTitles={unlockedTitles}
          activeTitle={activeTitle}
          onSelect={(id) => {
            setActiveTitle(id);
            setShowTitleModal(false);
            const titleDef = TITLE_DEFS.find((t) => t.id === id);
            if (titleDef) {
              setToastMsg(`대표 칭호가 [${titleDef.label}]으로 변경되었습니다`);
            }
          }}
          onClose={() => setShowTitleModal(false)}
        />
      )}

      {toastMsg && (
        <Toast
          message={toastMsg}
          subMessage=""
          kind="system"
          onClose={() => setToastMsg(null)}
        />
      )}

      {/* 패치노트 작성 버튼 */}
      <button onClick={() => navigate('/daily')} className="t-btn-primary">
        {todayPatch ? '▶ 오늘 패치노트 수정하기' : '▶ 오늘의 패치노트 작성'}
      </button>
    </div>
  );
}
