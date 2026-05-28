# DESIGN.md — 현생 RPG 디자인 시스템 v2

PRD 8장 기반. 이 파일이 디자인의 단일 진실 공급원(SSOT)입니다.

> **v2 변경 요약** — 컬러: `gold`, `purple-glow` 토큰 추가 / 폰트: JetBrains Mono + Orbitron 디스플레이 페어 / 효과: 전역 CRT 스캔라인 + 포스퍼 글로우 / 스탯바: 10블록 + 등락 티커 박스 / 스킬바: 100세그먼트 포스퍼 게이지

---

## 테마

- **다크모드 전용** — 라이트모드 없음, 절대 추가하지 않음
- **무드:** 사이버펑크 터미널 · 8비트 BBS · 포스퍼 CRT
- **시그니처:**
  - 글로벌 스캔라인 오버레이 (`body::before`)
  - 포스퍼 텍스트 글로우 (`.t-glow`)
  - ASCII 코너 브래킷 패널 (`.t-panel--bracket`)
  - 골드 액센트는 **만렙 · 칭호 · 희귀 전용** (희소성 유지)

---

## 컬러 팔레트

### 배경

| 역할          | 토큰                   | 값        |
| ------------- | ---------------------- | --------- |
| 루트 배경     | `bg-bg-root`           | `#08080c` |
| 카드 배경     | `bg-bg-card`           | `#0e0e16` |
| 인풋 배경     | `bg-bg-input`          | `#1a1a26` |
| 엘리베이션    | `bg-bg-elev`           | `#20203a` |
| 구분선/테두리 | `border-border`        | `#2a2a3a` |
| 강한 테두리   | `border-border-strong` | `#3a3a55` |

### 브랜드

| 역할            | 토큰             | 값        | 용도                             |
| --------------- | ---------------- | --------- | -------------------------------- |
| 퍼플 메인       | `purple-primary` | `#534ab7` | CTA, 활성 상태                   |
| 퍼플 다크       | `purple-dark`    | `#4340a0` | hover                            |
| 퍼플 라이트     | `purple-light`   | `#afa9ec` | 레이블, 서브 텍스트, 코너 브래킷 |
| **퍼플 글로우** | `purple-glow`    | `#7a6fff` | 스킬바 채움, 글로우 베이스       |
| **골드**        | `gold`           | `#f5c542` | 만렙, 칭호, 희귀                 |
| **골드 글로우** | `gold-glow`      | `#ffd970` | text-shadow                      |

### 상태

| 역할        | 토큰      | 값        |
| ----------- | --------- | --------- |
| 위험 / 부정 | `danger`  | `#f0997b` |
| 경고 / 중간 | `warning` | `#ef9f27` |
| 긍정 / 안전 | `success` | `#5dcaa5` |

### 텍스트

| 역할   | 토큰        | 값        |
| ------ | ----------- | --------- |
| 기본   | `text-base` | `#e2e8f0` |
| 서브   | `text-sub`  | `#6b7280` |
| **딤** | `text-dim`  | `#4a4a5a` |
| 화이트 | `white`     | `#ffffff` |

---

## 타이포그래피

| 역할                              | 폰트                          | 비고                           |
| --------------------------------- | ----------------------------- | ------------------------------ |
| 본문 / 레이블 / 수치              | **JetBrains Mono**            | 모노스페이스, 게임 터미널 느낌 |
| 디스플레이 / 캐릭터명 / 레벨 숫자 | **Orbitron** (`font-display`) | 헤딩, 큰 숫자에만 사용         |

| 용도                   | 폰트               | 크기           | tracking |
| ---------------------- | ------------------ | -------------- | -------- |
| 페이지 타이틀          | Orbitron 700       | 18–20px        | 0.06em   |
| 캐릭터 레벨 숫자       | Orbitron 700       | 26–28px        | 0.04em   |
| 섹션 라벨 (`.t-label`) | JetBrains Mono 500 | 11px UPPERCASE | 0.12em   |
| 본문                   | JetBrains Mono 400 | 13px           | 0        |
| 수치 / 뱃지            | JetBrains Mono 700 | 11–12px        | 0.04em   |
| 캡션 / 메타            | JetBrains Mono 400 | 10–11px        | 0        |

> 다른 폰트 패밀리 추가 금지.

---

## 글로우 / 효과

```css
.t-glow {
  text-shadow:
    0 0 8px currentColor,
    0 0 14px currentColor;
}
.t-glow-soft {
  text-shadow: 0 0 6px rgba(175, 169, 236, 0.55);
}
.t-glow-gold {
  text-shadow:
    0 0 8px #ffd970,
    0 0 16px #ffd970;
}
```

- 글로우는 **강조 텍스트 / 만렙 / CTA / 변화량 강조** 에만. 본문에는 쓰지 말 것.
- 박스 글로우는 `box-shadow: 0 0 Npx ${color}33` 패턴 (33 = 20% 알파).

---

## 레이아웃

(v1과 동일)

- 최대 너비 **430px** 모바일 우선
- 페이지 패딩: `px-4 pt-4 pb-24`
- 카드 패딩: `p-4`
- 카드 간격: `gap-3` 또는 `space-y-3`
- 카드 라운딩: **없음** (각진 엣지 유지 — `rounded-*` 클래스 추가 금지)
- 하단 탭바: `fixed bottom-0`

---

## 컴포넌트 패턴

### 패널 — `<Panel>`

```tsx
<Panel>...</Panel>                   {/* ASCII 코너 브래킷 (기본) */}
<Panel bracket={false}>...</Panel>   {/* 그냥 1px 보더만 */}
```

내부 구현:

```css
.t-panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 1rem;
}
.t-panel--bracket::before {
  /* 좌상단 ┌ */
}
.t-panel--bracket::after {
  /* 우하단 ┘ */
}
```

### 스탯 바 — `<StatBar>` (10블록 + 등락 티커)

```tsx
<StatBar icon="❤️" label="체력" value={62} delta={-8} />
```

- **10 블록** 가로 배치 (각 블록 flex-1, height 10px)
- 채워진 블록 글로우: `box-shadow: 0 0 6px ${color}`
- 컬러 룰:
  - `value >= 70` → `success`
  - `value >= 40` → `warning`
  - `value < 40` → `danger`
- `delta` 가 0이 아니면 우측에 **티커 박스** (`▲ 12` 또는 `▼ 8`) — 컬러 외곽선 + 미세 글로우. `delta` 미지정 시 박스 안 나옴 (홈의 7일 평균 등 등락 표시 불필요한 자리).

### 스킬 진행 바 — `<SkillBar>` (100세그먼트 포스퍼)

```tsx
<SkillBar icon="🐷" label="돼지력" level={7} count={36} max={50} unit="회" />
```

- **100개 세그먼트**, gap 1.5px, 각 셀의 안쪽 65% 너비에 막대 그림
- 채워진 세그먼트는 `purple-glow` + 글로우, 빈 세그먼트는 opacity 0.14
- 만렙 (`level >= 10`) 시 → 골드 컬러 + `[ MAX ]` 라벨
- 우측 라벨: `62% · 14회 남음`

### 버프 / 디버프 태그 — `<BuffTag>`

```tsx
<BuffTag label="커피버프" type="buff" />
<BuffTag label="통장출혈" type="debuff" />
<BuffTag label="진정한 돼지왕" type="rare" />
```

- 각진 모서리 (라운딩 없음) — v1의 `rounded-full` 제거
- 컬러 외곽선 + 미세 글로우 + 화살표 아이콘 (`▲ ▼ ★`)
- 클래시파이어 헬퍼: `classifyTag(tag)` 로 화이트리스트 기반 buff/debuff 자동 판정

### 버튼 — 메인 / 고스트

```tsx
<button className="t-btn-primary">▶ 패치노트 저장</button>
<button className="t-btn-ghost">[ ESC ] 수정하기</button>
```

- 메인: `purple-primary` 배경 + `purple-glow` 박스 글로우
- 고스트: `bg-input` + `border` , hover 시 `purple-light` 외곽선
- 라운딩 없음 (각진 엣지)

### 슬라이더 / 카운터 / 칩

v1 유지. 단:

- 활성 칩의 배경에 `box-shadow: 0 0 12px rgba(122,111,255,0.45)` 글로우 추가 권장
- 라운딩(`rounded`) → 0 (각진 엣지)

### 이모지 선택기

v1 유지. 선택된 이모지의 ring → `box-shadow: 0 0 0 1px var(--color-purple-glow) inset, 0 0 12px rgba(122,111,255,0.4)` 로 글로우 강화.

---

## 토스트 — 획득 / 레벨업 / 칭호

| 종류          | 컬러          | 헤더                  | 사용 시점            |
| ------------- | ------------- | --------------------- | -------------------- |
| SYSTEM (일반) | `purple-glow` | `>>> SYSTEM <<<`      | 레벨업, 일반 알림    |
| RARE UNLOCK   | `gold`        | `>>> RARE UNLOCK <<<` | 만렙 달성, 칭호 언락 |

```
┌──────────────────────────────┐
│ >>> RARE UNLOCK <<<          │
│ 🐷 진정한 돼지왕             │  ← Orbitron, t-glow-gold
│ 만렙 달성 · 칭호 언락         │
└──────────────────────────────┘
```

기존 `src/components/Toast.tsx` 의 기본 스타일에 `box-shadow: 0 0 0 1px ${color} inset, 0 0 22px ${color}55` 글로우 추가.

---

## 네비게이션 (하단 탭바)

v1 유지. 활성 탭에 글로우 추가:

```tsx
<span
  style={{
    textShadow: isActive ? '0 0 8px var(--color-purple-light)' : 'none',
  }}>
  {tab.icon}
</span>
```

활성 탭 위쪽에 2px 보라색 글로우 라인 추가 권장 (HUD 액센트):

```tsx
{
  isActive && (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 22,
        height: 2,
        background: 'var(--color-purple-glow)',
        boxShadow: '0 0 10px var(--color-purple-glow)',
      }}
    />
  );
}
```

---

## 아이콘 / 이모지

(v1과 동일) — 텍스트 이모지를 아이콘으로 사용.

| 용도     | 이모지 |
| -------- | ------ |
| 체력     | ❤️     |
| 집중력   | 🧠     |
| 사회성   | 💬     |
| 지갑     | 💸     |
| 외출의지 | 🚪     |
| 수면질   | 😴     |
| 돼지력   | 🐷     |
| 거지력   | 🪙     |
| 각성력   | ☕     |
| 숙면력   | 🛌     |

추가 ASCII 글리프 (장식용):
| 용도 | 글리프 |
| ------------ | ------- |
| 좌측 마커 | `◢ ▌ >` |
| 코너 브래킷 | `┌ ┐ └ ┘` |
| 등락 | `▲ ▼` |
| 희귀 | `★ ◆` |

---

## 감정 이모지 8종

(v1 유지) `😊` `😐` `😴` `😤` `🥲` `🤯` `🔥` `💀`

---

## 애니메이션

- 전환: `transition-colors`, `transition-opacity` (140–200ms)
- 글로우는 정적 — 펄스 애니메이션 금지 (성능 + 시각적 노이즈)
- 만렙 달성 이펙트: 토스트 표시 + `t-glow-gold` 페이드인 (별도 라이브러리 X)
- 과도한 애니메이션 금지 — 절제된 피드백만

---

## 사용 금지

- ❌ 라운딩 (`rounded-md`, `rounded-lg`, `rounded-full` 등) — 각진 엣지 유지
- ❌ 다른 폰트 패밀리 추가
- ❌ `--color-gold` 일반 강조 사용 (희소성 유지)
- ❌ 펄스/네온 깜빡임 애니메이션
- ❌ 임의 컬러 (팔레트 외)
- ❌ 라이트 모드
  ㅈ
