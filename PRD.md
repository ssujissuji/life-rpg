# 📋 현생 RPG — PRD (Product Requirements Document)

**버전:** v0.2  
**작성일:** 2026.05.17  
**개발자:** 1인 프론트엔드 (바이브코딩)  
**기반:** 기획서 v0.1 + 프로토타입 검토 반영

---

## 1. 프로젝트 개요

### 서비스 한 줄 정의

> "내 하루를 게임 패치노트로 기록하고, 내 인생을 RPG 캐릭터 시트로 보는 앱"

### 핵심 컨셉

- 날마다 오늘의 현생 상태를 **패치노트 형식**으로 기록
- 누적된 데이터가 **캘린더**에 쌓임
- 주간/월간 분석으로 **레벨업 / 스킬 성장** 확인
- 나이 = 레벨, 특수스킬 만렙 조건 달성 시 잠금해제

### 타겟 유저

- 밈 문화에 익숙한 20~30대
- "오늘도 살아있다"는 걸 기념하고 싶은 직장인/취준생
- 일기는 귀찮지만 게임은 즐기는 사람

---

## 2. 핵심 기능 명세

### 2-1. 오늘의 패치노트 (Daily Log)

매일 입력하는 화면. 최대한 빠르게 입력 가능하도록 설계.

| 항목             | 방식      | UI 컴포넌트                            | 비고                             |
| ---------------- | --------- | -------------------------------------- | -------------------------------- |
| 날짜/요일        | 자동      | 텍스트                                 | 버전 형식 `v2026.05.17 (일요일)` |
| 날씨             | API 자동  | Pill 배지                              | OpenWeatherMap                   |
| 미세먼지         | API 자동  | Pill 배지                              | 에어코리아                       |
| 공휴일/주말 여부 | 자동 판별 | Pill 배지                              | 공공데이터포털                   |
| 수면 시간        | 직접 입력 | 슬라이더 (0~12h, step 0.5)             | —                                |
| 식사 횟수        | 직접 입력 | 탭 버튼 (0끼 / 1끼 / 2끼 / 3끼 / 3끼+) | —                                |
| 카페 방문        | 직접 입력 | +/− 카운터                             | 회 단위                          |
| 배달 주문        | 직접 입력 | +/− 카운터                             | 회 단위                          |
| 지출 규모        | 직접 입력 | 금액 칩 선택 → 합산 (1천/5천/1만/3만/5만/10만/+) | 클릭마다 누적, 합계 실시간 표시 |
| 오늘의 감정      | 직접 입력 | 이모지 선택 (8종)                      | 😊😐😴😤🥲🤯🔥💀                 |
| 한 줄 메모       | 선택 입력 | 텍스트 인풋                            | 오늘의 특이사항                  |

**결과 카드 예시:**

```
📋 v2026.05.17 (일요일) 😴
상태: 수면부족 / 커피버프 / 통장출혈

[능력치 변화]
❤️  체력      ████░░░░  55  (-5)
🧠 집중력    ██░░░░░░  40  (-5)
💬 사회성    ████░░░░  70  (0)
💸 지갑      █░░░░░░░  22  (-8)
🚪 외출의지  ██░░░░░░  40  (-15)
😴 수면질    ███░░░░░  58  (+18)

"오늘도 어떻게든 버텼다. 수고했어."
```

---

### 2-2. 캐릭터 시트 (Character Sheet) — 홈 화면

내 인생 캐릭터를 한눈에 보는 메인 화면.

```
[캐릭터 프로필]
이름: 홍길동
클래스: 취준생
Lv. 25  ████████░░  다음 레벨까지 243일

[오늘의 상태 태그]
월요병 / 수면부족 / 커피버프 / 통장출혈 / 외출의지 저하

[기본 스탯] — 최근 7일 평균 (6종)
❤️  체력      60/100
🧠 집중력    45/100
💬 사회성    70/100
💸 지갑      30/100
🚪 외출의지  55/100
😴 수면질    40/100

[특수스킬] — 4종
🐷 돼지력   Lv.7  ███████░░░  만렙까지 3회  ⚠️
🪙 거지력   Lv.2  ██░░░░░░░░  만렙까지 28일
☕ 각성력   Lv.4  ████░░░░░░  만렙까지 60회
🛌 숙면력   Lv.0  ░░░░░░░░░░  만렙까지 30회
```

---

### 2-3. 캘린더 뷰 (Calendar View)

월간 캘린더에서 각 날짜의 패치노트 카드를 미리보기.

- 날짜 셀에 당일 **감정 이모지** 표시
- 날짜 클릭 시 해당 날의 패치노트 결과 카드 모달로 표시
- 기록 없는 날은 회색 처리

---

### 2-4. 주간/월간 분석 (Analysis)

**주간 리포트 예시:**

```
📊 이번 주 현생 리포트 (5/11 ~ 5/17)

이번 주 너는 수면부족 상태로 5일을 버텼다.
체력 -15, 하지만 근성 +20 획득.

✅ 출석: 7/7일 기록
🏆 이번 주 MVP 스탯: 사회성 (+12)
⚠️ 위험 스탯: 지갑 (-35, 역대 최저)
🎉 스킬 성장: 돼지력 Lv.6 → Lv.7

[주간 판정]
🟢 생존 성공 — "이번 주도 살아냈다. 수고했어."
```

**월간 리포트:**

- 이번 달 평균 수면, 지출 패턴, 최악의 날 / 최고의 날
- 스킬 성장 그래프
- 다음 달 예측 메시지

---

### 2-5. 특수스킬 시스템 (Skill System)

> **v0.1 대비 변경:** 아첨능력·거짓말능력 제거 (MVP 범위 초과). 스킬명 `-력` 접미사로 통일.

스킬별 만렙 조건 (데이터 기반 자동 계산)

| 스킬명 | 아이콘 | 만렙 조건                 | 만렙 레벨 | 설명            |
| ------ | ------ | ------------------------- | --------- | --------------- |
| 돼지력 | 🐷     | 배달/카페 소비 누적 50회  | Lv.10     | 먹는 것만이 낙  |
| 거지력 | 🪙     | 소비 0원 기록 30일 누적   | Lv.10     | 절약의 신       |
| 각성력 | ☕     | 카페 방문 100회 누적      | Lv.10     | 커피 없이 못 삼 |
| 숙면력 | 🛌     | 8시간 이상 수면 30회 누적 | Lv.10     | 꿀잠 마스터     |

만렙 달성 시: 특수 칭호 + 애니메이션 이펙트 + 언락 메시지

---

### 2-6. 칭호 시스템 (Title System)

캐릭터 시트에 칭호 컬렉션 섹션을 추가하고, 대표 칭호를 프로필에 표시하는 기능.

#### 칭호 목록 (총 10개)

| id | label | icon | rarity | 달성 조건 |
|---|---|---|---|---|
| pig_max | 진정한 돼지왕 | 🐷 | legendary | 돼지력 만렙 |
| poor_max | 절약의 신 | 🪙 | legendary | 거지력 만렙 |
| cafe_max | 카페인 마스터 | ☕ | legendary | 각성력 만렙 |
| sleep_max | 꿀잠의 전설 | 🛌 | legendary | 숙면력 만렙 |
| survivor_30 | 한 달 생존자 | 🗓 | rare | 패치노트 30일 누적 |
| survivor_100 | 백일의 전사 | 🏆 | legendary | 패치노트 100일 누적 |
| streak_7 | 주간 완주자 | 🔥 | common | 7일 연속 기록 |
| zero_spend_7 | 이번 주 무일푼 | 💀 | rare | 7일 연속 무지출 |
| sleep_master_5 | 숙면 연속 5일 | 😴 | common | 5일 연속 꿀잠달성 태그 |
| all_max | 현생 완전정복 | 👑 | legendary | 스킬 4개 모두 만렙 |

#### UX 규칙

- 미획득 칭호: 잠금 상태로 전체 표시 (`???`, opacity 낮춤), 희귀도별 테두리 색상 구분
  - legendary: `var(--color-gold)`
  - rare: `var(--color-purple-glow)`
  - common: `var(--color-border)`
- 대표 칭호 선택: 각 획득 칭호 카드에 별도 "선택" 버튼
- 프로필의 대표 칭호를 탭 → `TitleSelectModal` 열림 (보유 칭호 중 변경)
- 대표 칭호 미선택 시 프로필 이름 아래 칭호 영역 미표시

#### 데이터 구조 (localStorage)

```javascript
// 획득한 칭호 목록 키: "unlocked_titles"
["pig_max", "streak_7"]

// 대표 칭호 키: "active_title"
"pig_max"   // 없으면 null
```

#### 타입 정의

```typescript
type TitleRarity = 'common' | 'rare' | 'legendary';

interface TitleDef {
  id: string;
  label: string;
  icon: string;
  rarity: TitleRarity;
}
```

#### 달성 감지 시점

- `PatchResult.tsx` — 저장(`fromSave`) 직후, 기존 만렙 토스트 큐와 병합하여 순차 표시

---

## 3. 화면 구조 (IA)

```
앱 진입
├── 온보딩 (/onboarding) — 최초 진입 시에만 (onboarding_done 키 없으면 리다이렉트)
│   ├── Step 1: 캐릭터명 입력
│   ├── Step 2: 클래스 선택 (탭 6종 + 직접 입력)
│   ├── Step 3: 출생연도 입력
│   └── Step 4: 개인 기준값 설정 (선택, 건너뛰기 가능)
│       ├── 수면 목표시간 슬라이더 (4~10h, step 0.5, 기본 7h)
│       ├── 카페인 max 잔수 카운터 (1~5, 기본 2잔)
│       └── 통장출혈 기준 금액 칩 선택 (1만/2만/3만/5만/10만, 기본 3만)
├── 캐릭터 시트 (홈)
│   ├── 오늘 패치노트 작성 버튼
│   └── 스킬 상세 모달 (클릭)
├── 캘린더 뷰
│   └── 날짜 클릭 → 패치노트 결과 카드 모달
├── 분석
│   ├── 주간 리포트
│   └── 월간 리포트
└── 설정
    ├── 캐릭터명 / 클래스명 설정
    ├── 나이(레벨) 설정
    ├── 개인 기준값 설정 (sleepGoal / cafeMax / spendThreshold)
    └── 데이터 초기화
```

---

## 4. 기술 스택

| 구분       | 선택            | 이유                                 |
| ---------- | --------------- | ------------------------------------ |
| 프레임워크 | React + Vite + TypeScript | 빠른 세팅, 타입 안정성, 생태계 풍부  |
| 스타일링   | Tailwind CSS    | 빠른 UI 구현                         |
| 상태관리   | Zustand         | 가볍고 간단                          |
| 저장소     | localStorage    | MVP (로그인 불필요, 클라이언트 전용) |
| 날씨 API   | OpenWeatherMap  | 무료 플랜 충분                       |
| 미세먼지   | 에어코리아      | 공공 무료 API                        |
| 공휴일     | 공공데이터포털  | 공공 무료 API                        |
| 라우팅     | React Router v6 | 표준                                 |
| 캘린더     | react-calendar  | 커스텀 용이                          |
| 차트       | Recharts        | 분석 화면용                          |

---

## 5. 핵심 로직 — 능력치 계산

능력치 계산 함수(`calcHP`, `calcFocus`, `calcSleepQ`, `getStatusTags`)는 `baseline` 인자를 받아 개인 기준값 기반으로 계산합니다. `baseline`이 없으면 `DEFAULT_BASELINE`으로 fallback합니다.

```typescript
// 개인 기준값 타입
interface Baseline {
  sleepGoal: number;      // 수면 목표시간 (4~10h, step 0.5, 기본 7h)
  cafeMax: number;        // 카페인 max 잔수 (1~5, 기본 2)
  spendThreshold: number; // 통장출혈 기준 금액 (원, 기본 30000)
}

const DEFAULT_BASELINE: Baseline = {
  sleepGoal: 7,
  cafeMax: 2,
  spendThreshold: 30000,
};

// 꿀잠 기준 = sleepGoal + 1h (UI 미노출, 내부 계산에만 사용)
const HONEY_SLEEP_THRESHOLD = baseline.sleepGoal + 1;

// 체력 계산 (baseline.sleepGoal 기준 수면 부족 판정)
function calcHP(sleep, meal, isWeekend, baseline = DEFAULT_BASELINE) {
  let hp = 100;
  if (sleep < baseline.sleepGoal - 2) hp -= 30;
  else if (sleep < baseline.sleepGoal - 1) hp -= 20;
  else if (sleep < baseline.sleepGoal) hp -= 10;
  if (meal === 0) hp -= 15;
  if (isWeekend) hp += 15;
  return Math.max(0, Math.min(100, hp));
}

// 집중력 계산 (baseline.cafeMax 기준 커피버프 판정)
function calcFocus(sleep, cafeCount, isMonday, baseline = DEFAULT_BASELINE) {
  let focus = 100;
  if (sleep < baseline.sleepGoal - 2) focus -= 35;
  else if (sleep < baseline.sleepGoal) focus -= 20;
  if (cafeCount >= baseline.cafeMax) focus += 10;
  if (isMonday) focus -= 10;
  return Math.max(0, Math.min(100, focus));
}

// 지갑 계산 (spend = 실제 금액, 원 단위)
function calcWallet(spend, cafeCount, deliveryCount) {
  let wallet = 100;
  if (spend > 0 && spend < 10000) wallet -= 10;
  else if (spend < 30000) wallet -= 20;
  else if (spend < 50000) wallet -= 45;
  else if (spend < 100000) wallet -= 60;
  else if (spend >= 100000) wallet -= 80;
  wallet -= cafeCount * 8;
  wallet -= deliveryCount * 10;
  return Math.max(0, Math.min(100, wallet));
}

// 상태 태그 계산 (baseline 기준값 반영)
function getStatusTags({
  sleep,
  cafeCount,
  spend,
  deliveryCount,
  isMonday,
  isWeekend,
  baseline = DEFAULT_BASELINE,
}) {
  const tags = [];
  if (isMonday) tags.push('월요병');
  if (sleep < baseline.sleepGoal - 1) tags.push('수면부족');
  if (cafeCount >= baseline.cafeMax) tags.push('커피버프');
  if (spend >= baseline.spendThreshold) tags.push('통장출혈');
  if (deliveryCount >= 1) tags.push('배달의민족');
  if (sleep >= baseline.sleepGoal + 1) tags.push('꿀잠달성');
  if (spend === 0 && cafeCount === 0) tags.push('무지출');
  return tags;
}
```

---

## 6. 데이터 구조 (localStorage)

```javascript
// 일별 기록 키: "patch_2026-05-17"
{
  date: "2026-05-17",
  sleep: 7,
  meal: 2,
  cafe: 1,
  delivery: 0,
  spend: 53000,      // 실제 지출 금액 (원 단위), 0 = 무지출
  emoji: "😊",
  memo: "오늘은 그나마 괜찮았다",
  stats: {
    hp: 75, focus: 60, social: 75, wallet: 62, outdoor: 60, sleepQ: 58
  },
  tags: ["커피버프"]
}

// 캐릭터 설정 키: "character"
{
  name: "홍길동",
  class: "취준생",
  birthYear: 2001   // 나이 = 레벨 계산용
}

// 개인 기준값 키: "baseline"
{
  sleepGoal: 7,          // 수면 목표시간 (h), 기본 7
  cafeMax: 2,            // 카페인 max 잔수, 기본 2
  spendThreshold: 30000  // 통장출혈 기준 금액 (원), 기본 30000
}

// 온보딩 완료 플래그 키: "onboarding_done"
// 값: "1" (존재 여부로만 판단)
```

> 개인 기준값 변경은 이후 기록부터만 적용됩니다. 기존 PatchEntry를 소급 재계산하지 않습니다.

---

## 7. 개발 단계 (로드맵)

### Phase 1 — MVP (2~3주)

- [ ] 프로젝트 세팅 (Vite + React + Tailwind + Zustand)
- [ ] 오늘의 패치노트 입력 화면
- [ ] 능력치 계산 로직
- [ ] 결과 카드 렌더링
- [ ] localStorage 저장/불러오기
- [ ] 캘린더 뷰 (기록 표시)

### Phase 1.5 — 온보딩 + 개인 기준값

- [ ] 온보딩 화면 (`/onboarding`) 신규 구현
  - Step 1: 캐릭터명 입력
  - Step 2: 클래스 선택 (탭 6종 + 직접 입력)
  - Step 3: 출생연도 입력
  - Step 4: 개인 기준값 설정 (건너뛰기 가능 → DEFAULT_BASELINE 저장)
- [ ] `App.tsx` — `onboarding_done` 키 없으면 `/onboarding` 리다이렉트
- [ ] `src/types.ts` — `Baseline` 인터페이스 추가
- [ ] `src/lib/storage.ts` — `loadBaseline()`, `saveBaseline()` 추가
- [ ] `src/lib/stats.ts` — `calcHP`, `calcFocus`, `calcSleepQ`, `getStatusTags` baseline 인자 추가
- [ ] `src/pages/Settings.tsx` — 개인 기준값 설정 섹션 추가

### Phase 2 — 캐릭터 시스템 (1~2주)

- [ ] 캐릭터 시트 홈 화면
- [ ] 레벨(나이) 설정
- [ ] 특수스킬 4종 + 만렙 조건 로직
- [ ] 만렙 달성 이펙트

### Phase 3 — 분석 (1~2주)

- [ ] 주간 리포트 화면
- [ ] 월간 리포트 화면
- [ ] 스탯 그래프 (Recharts)
- [ ] AI 분석 메시지 (선택: Claude API 연동)

### Phase 4 — 완성도 (1주)

- [ ] 날씨/미세먼지 API 연동
- [ ] 공휴일 API 연동
- [ ] 카드 이미지 저장/공유 기능
- [ ] 반응형 모바일 UI
- [ ] 배포 (Vercel)

---

## 8. 디자인 시스템

- **테마:** 다크모드 전용
- **폰트:** 모노스페이스 (게임 터미널 느낌)
- **메인 컬러:** 퍼플 계열 (`#534ab7`, `#afa9ec`)
- **배경:** `#0f0f13` (루트), `#12121a` (카드), `#1e1e2e` (인풋)
- **상태 컬러:**
  - 🔴 위험/부정: `#f0997b` (coral)
  - 🟡 경고: `#ef9f27` (amber)
  - 🟢 긍정: `#5dcaa5` (teal)

---

## 9. 확장 기능 로드맵 (Phase 5+)

### 핵심 결정 사항

- 로그인 없이도 앱이 완전히 작동하는 **게스트 모드 영구 지원**
- 진입 화면은 **별도 `/landing` 라우트**로 분리
- **로그인 + DB + 랭킹은 세트로 묶어 추후 결정** — 로그인만 따로 도입하지 않음

---

### Phase 5 — 진입 화면 개선 & 설정 강화 (단기)

#### 5-1. Landing Page 분리

- 목적: 기존 사용자에게 "게임 재개" 느낌의 진입 경험 제공
- `/landing` 라우트 신규 생성 (Onboarding은 신규 사용자 전용 유지)
- `App.tsx` 라우트 가드: `onboarding_done` 있으면 `/landing`, 없으면 `/onboarding`
- 기존 사용자 화면 구성:
  - localStorage에서 캐릭터명, 레벨(나이), 기록 수를 읽어 터미널 스타일 메시지 출력
  - 예: `> PLAYER FOUND: {이름} (LV.{나이}) — 기록 {N}개 확인`
  - "현생 로그인" 버튼으로 메인 화면(`/`) 진입
- 데이터 소스: `loadCharacter()`, `loadAllPatches()`, `isOnboardingDone()` — 모두 `src/lib/storage.ts`에 기존 존재

#### 5-2. 설정 About 섹션

- Settings 페이지 하단에 About 섹션 추가
- 내용: 앱 버전, 창작자 정보 (정적 텍스트)
- `src/pages/Settings.tsx` 수정만으로 완료

---

### Phase 6 — 캐릭터 비주얼 & 아이템 시스템 (중기, localStorage 기반)

- 목적: 캐릭터 페이지에 시각적 정체성 부여, 업적 달성의 보상감 강화
- **전제 조건: 캐릭터 비주얼 방향(픽셀아트 vs 이모지 조합) 확정 필요 — 미확정 상태로 구현 보류 중**

확정 후 구현할 내용:

- 캐릭터 시트 상단에 캐릭터 비주얼 영역 추가
- 아이템 획득 조건: 특수스킬 만렙 달성, 연속 기록 N일 달성 등
- 아이템 슬롯: head / body / accessory 3종
- 새 localStorage 키: `owned_items` (string[]), `equipped_items` ({ head, body, accessory })
- 새 파일: `src/lib/items.ts` — 아이템 메타데이터 상수 정의
- 설정 페이지에 캐릭터 옷장 섹션 추가

데이터 구조 (확정 후 적용):

```javascript
// 보유 아이템 키: "owned_items"
["item_001", "item_002"]

// 장착 아이템 키: "equipped_items"
{ "head": "item_001", "body": null, "accessory": null }
```

---

### Phase 7 — 로그인 + DB + 랭킹 (장기, 추후 결정)

> 현재 localStorage 기반으로 앱이 완전히 작동하며, 로그인/DB/랭킹은 세트로 묶어 추후 함께 결정한다.
> 로그인만 따로 도입하는 것은 의미 없음 (localStorage 데이터를 서버에서 가져올 수 없으므로).

검토 중인 방향 (미확정):

- DB: Neon (PostgreSQL 서버리스, pause 없음, DBeaver 연결 가능)
- Auth: Clerk (카카오/네이버 OAuth 지원)
- 프레임워크 전환: Next.js 마이그레이션 검토 (API 라우트 내장으로 별도 백엔드 불필요)
- 게스트 모드: 로그인 없이도 앱 전체 기능 사용 가능 유지 전제

랭킹 기능 (Phase 7 완료 후):

- 주간/월간 잠만보 랭킹, 수면 꾸준왕, 무지출 챌린저
- 캐릭터명 + 클래스만 노출 (개인정보 보호)
- 랭킹 참여 여부 설정에서 개인 제어

---

_다음 단계: Phase 5-1 Landing Page 분리_
