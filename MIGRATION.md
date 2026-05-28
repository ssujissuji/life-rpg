# MIGRATION — Terminal.sys v2 적용 가이드

A안(TERMINAL.SYS)을 실제 프로젝트에 옮기는 단계별 가이드. 이 폴더의 파일들은 그대로 `life-rpg/` 의 동일 경로에 덮어쓰거나 추가하면 됩니다.

---

## 1. 폰트 추가 — `index.html`

`<head>` 에 추가:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Orbitron:wght@500;600;700&display=swap" />
```

## 2. 토큰 + 효과 클래스 — `src/index.css`

`apply-to-project/src/index.css` 로 덮어쓰기. 주요 변경:
- `--color-gold`, `--color-purple-glow` 토큰 신규
- `--font-display` (Orbitron) 신규
- 전역 CRT 스캔라인 오버레이 (body::before)
- `.t-panel`, `.t-glow`, `.t-glow-gold`, `.t-label`, `.t-h1` 헬퍼 클래스

## 3. 컴포넌트 교체 / 신규

| 파일 | 작업 | 비고 |
| --- | --- | --- |
| `src/components/StatBar.tsx` | **덮어쓰기** | `delta` prop 추가, 10-블록 + 글로우 + 티커 박스 |
| `src/components/SkillBar.tsx` | **신규** | 100-세그먼트 포스퍼 게이지 (CharacterSheet 인라인 코드 대체) |
| `src/components/Panel.tsx` | **신규** | ASCII 코너 브래킷 패널 래퍼 |
| `src/components/BuffTag.tsx` | **신규** | 버프/디버프/레어 3종 태그 |

## 4. CharacterSheet.tsx · DailyLog.tsx · PatchResult.tsx — 작은 치환

기존 `bg-bg-card border border-border rounded-lg p-4` 카드 → `<Panel>` 컴포넌트로 교체  
기존 인라인 skill bar (Array length 10 매핑) → `<SkillBar />` 컴포넌트로 교체  
기존 상태 태그 `<span>` → `<BuffTag>` 로 교체

자세한 치환 예시는 본 가이드 하단 "치환 패턴" 섹션 참고.

## 5. `docs/DESIGN.md` 갱신

`apply-to-project/docs/DESIGN.md` 로 덮어쓰기 (v2 토큰 + 컴포넌트 패턴 반영).

---

## 치환 패턴

### CharacterSheet — 스킬 행 (Before → After)

**Before** (CharacterSheet.tsx, 인라인):
```tsx
<button className="w-full text-left space-y-1 ...">
  <div className="flex items-center justify-between text-xs font-mono">
    {/* label + level + 남은 카운트 */}
  </div>
  <div className="flex gap-px">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className={`flex-1 h-2 ...`} />
    ))}
  </div>
</button>
```

**After**:
```tsx
<button onClick={() => setSelectedSkill(sk)} className="w-full text-left">
  <SkillBar
    icon={sk.icon}
    label={sk.label}
    level={data.level}
    count={data.count}
    max={sk.max}
    unit={sk.unit}
  />
</button>
```

### 상태 태그 (Before → After)

**Before**:
```tsx
<span className="text-xs px-2 py-0.5 rounded-full bg-bg-input text-purple-light border border-border font-mono">
  {tag}
</span>
```

**After**:
```tsx
<BuffTag label={tag} type={isPositive(tag) ? 'buff' : 'debuff'} />
```

(positive 판정 헬퍼는 `src/lib/stats.ts` 에 `BUFF_TAGS = ['커피버프','꿀잠달성','무지출']` 같은 화이트리스트로 추가)

### 카드 (Before → After)

**Before**:
```tsx
<div className="bg-bg-card border border-border rounded-lg p-4 space-y-3">
  ...
</div>
```

**After**:
```tsx
<Panel className="space-y-3">
  ...
</Panel>
```

`Panel` 의 `bracket={false}` 로 코너 브래킷 끄기 가능.

### StatBar 사용 (등락 표시)

```tsx
<StatBar icon="❤️" label="체력" value={62} delta={-8} />
```

`delta` 가 0 또는 미지정이면 박스가 안 나옴. PatchResult 에서는 전일 대비 값을 계산해서 전달.

---

## 적용 순서 추천

1. `index.html` 폰트 — 5분
2. `src/index.css` 덮어쓰기 — 5분
3. 새 컴포넌트 4종 추가 (`Panel`, `SkillBar`, `BuffTag`, 새 `StatBar`) — 15분
4. `CharacterSheet.tsx` 치환 — 10분 (가장 임팩트 큼)
5. `PatchResult.tsx` 치환 + `delta` 계산 로직 — 15분
6. `DailyLog.tsx` 의 카드 → Panel 치환만 — 10분
7. `Landing.tsx` 의 카드 → Panel + 골드 액센트 — 5분
8. `DESIGN.md` 덮어쓰기 — 1분

**총 1시간 ~ 1시간 반 정도 예상.** 한 번에 다 하지 말고 PR 단위로 쪼개도 좋아요 (예: PR1 = 토큰 + 컴포넌트 추가, PR2 = CharacterSheet 적용, PR3 = 나머지 페이지).

---

## 주의사항

- `BottomNav` 의 이모지 아이콘(`⚔️📋📅📊`)은 디자인상 `◍ ▤ ▦ ▥` 같은 유니코드 글리프로 바꾸면 더 터미널스럽지만, **현재 PRD/DESIGN의 이모지 컨벤션과 충돌**하므로 결정 후 적용. 일단은 유지 권장.
- `--color-gold`는 **만렙 / 희귀 / 칭호 언락** 전용 — 일반 강조에는 쓰지 말 것. 희소성 유지가 중요.
- 스캔라인 오버레이는 `position: fixed` 로 전역. 캘린더 / 모달 등 z-index 충돌 시 `body::before { z-index: 1; pointer-events: none; }` 가 항상 콘텐츠 아래에 있는지 확인.
- 모바일에서 `box-shadow` 글로우가 성능에 영향 줄 수 있음 — 스킬 행 100 세그먼트 글로우는 `will-change: opacity` 등 추가 불필요, 그대로 OK이지만 저사양 기기에서 끊기면 글로우 끄는 옵션 고려.
