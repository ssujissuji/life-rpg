# HISTORY.md — 완료된 작업 기록

완료된 작업을 날짜 역순으로 기록합니다.

---

## 2026-05-25

### Phase 3 — 분석 화면 구현

**Analysis.tsx (신규 구현, Phase 3 스텁 교체)**
- 주간/월간 탭 전환 UI 구현
- 데이터 없을 때 빈 상태 메시지 처리
- useMemo로 리포트·차트 데이터 계산 (탭 전환 시 불필요한 재계산 방지)

**신규 컴포넌트**
- `src/components/AnalysisTabBar.tsx` — 주간/월간 탭 컴포넌트
- `src/components/WeeklyReportCard.tsx` — 주간 리포트 카드 (출석 현황, MVP/위험 스탯, 스킬 성장, verdict 배지)
- `src/components/MonthlyReportCard.tsx` — 월간 리포트 카드 (평균 수면, 총 지출, 최고/최저일, 예측 메시지)
- `src/components/StatTrendChart.tsx` — Recharts LineChart (hp/focus/wallet 트렌드), `STAT_TREND_COLORS` export
- `src/components/SkillBarChart.tsx` — Recharts BarChart (4스킬 레벨)

**src/lib/date.ts (신규)**
- `today()`, `getWeekDateRange()` 추가
- CharacterSheet·DailyLog에 중복 정의되어 있던 날짜 유틸을 공용 모듈로 분리

**src/lib/stats.ts**
- `getWeekBounds`, `getMonthBounds`, `calcWeeklyReport`, `calcMonthlyReport`, `calcStatTrend` 추가

**리뷰 수정사항 반영**
- BLOCK-1: `calcWeeklyReport` — mvpStat === dangerStat인 경우 `finalDangerStat = null`로 처리해 동일 스탯이 MVP/위험 양쪽에 표시되는 문제 해소
- BLOCK-2: `calcWeeklyReport` — skillsAfter 범위를 weekEntries로 제한 (전체 기록 기준으로 계산되던 스킬 성장이 해당 주 내 기록만 반영하도록 수정)
- WARN-1: `getWeekDateRange` 사용으로 날짜 범위 생성 일관성 확보
- WARN-2: `PatchResult.tsx` — `useStore.getState()` → `useStore((s) => s.skills)` 구독 방식으로 변경
- WARN-3: `PatchResult.tsx` — skills를 useMemo deps에 추가
- WARN-4: `calcMonthlyReport` — dayStats 불필요한 sort 제거
- WARN-5: `StatTrendChart.tsx` — 인라인 hex 컬러를 `STAT_TREND_COLORS` import로 통일

**테스트**
- `src/lib/analysis.test.ts` 신규 — vitest 단위 테스트 58개 (calcWeeklyReport/calcMonthlyReport/calcStatTrend 경계 케이스 포함)
- `e2e/analysis.spec.ts` 신규 — e2e 테스트 13개 (탭 전환, 빈 상태, 차트 렌더링 확인)

---

### Phase 2 후속 — 리뷰 수정 + 테스트 추가 + calcWallet 버그 수정

**storage.ts**
- `loadPatch`: `JSON.parse` 실패 시 null 반환 (try-catch 추가)
- `loadAllPatches`: 손상된 키는 건너뛰고 정상 키만 반환 (try-catch 추가)

**PatchResult.tsx**
- `useState` 초기화 함수 내 `saveMaxedSkills` 호출 제거. `useMemo`(순수 계산)와 `useEffect`(localStorage 쓰기)로 분리하여 React Strict Mode 이중 실행 시 토스트 큐 오염 방지

**types.ts**
- `SkillConfig` 인터페이스 추가, `key` 타입을 `keyof Skills`로 지정
- `SkillModal.tsx`, `CharacterSheet.tsx`의 `SkillConfig` import 경로를 `src/types.ts`로 통일

**CharacterSheet.tsx**
- `getStatusTags` 호출 시 `new Date().getDay()` → `new Date(todayPatch.date + 'T00:00:00').getDay()` 변경 (로컬 날짜 파싱 일관성 확보)

**stats.ts**
- `formatSpend` 조건식 `!amount || amount === 0` → `amount <= 0` 정리

**BUG-05 수정: calcWallet spend=0 fallthrough**
- 원인: `spend=0`일 때 `else if (spend < 30000)` 분기로 진입해 wallet `-20` 패널티가 적용됨
- 해결: `spend <= 0` 조건을 가장 먼저 검사해 페널티 없이 wallet 100 유지

**테스트 추가**
- `src/lib/stats.test.ts` 신규 — vitest 단위 테스트 67개 (calcHP/Focus/Social/Wallet/Outdoor/SleepQ/getStatusTags/formatSpend/calcStats)
- `src/lib/storage.test.ts` 신규 — vitest 단위 테스트 14개 (loadPatch/loadAllPatches 손상 JSON 방어 포함)
- `package.json`, `vite.config.ts` — vitest 설정 추가 (environment: jsdom)
- `e2e/patch-result.spec.ts` — fromSave 토스트 표시/미표시/큐 순차 케이스 3개 추가 (총 38개)

---

### Phase 2 — 만렙 달성 토스트 이펙트

- `src/lib/storage.ts` — `loadMaxedSkills()`, `saveMaxedSkills()` 추가. localStorage `skill_maxed` 키로 만렙 달성 기록을 저장해 재트리거 방지
- `src/components/Toast.tsx` — 공용 토스트 컴포넌트 신설. `onClose` 콜백을 `useRef`로 관리해 무한루프 버그 방지
- `src/pages/DailyLog.tsx` — 저장 후 `navigate(`/result/${date}`, { state: { fromSave: true } })` 추가. 결과 페이지에 저장 진입 여부를 전달
- `src/pages/PatchResult.tsx` — 만렙 감지 + 토스트 큐 로직 추가. `useLocation`의 `fromSave` 플래그가 있을 때만 만렙 체크 실행 (캘린더 등 직접 조회 시 미발동). 스킬 데이터는 `useStore.skills` 직접 참조. `SKILL_META` 타입을 `Record<keyof Skills, ...>`로 보강

---

## 2026-05-17

### 공통 CSS 토큰 전체 적용

- `index.css` `@theme`에 4개 토큰 추가: `--color-text-base(#e2e8f0)`, `--color-text-sub(#6b7280)`, `--color-border(#2a2a3a)`, `--color-purple-dark(#4340a0)`
- `index.css` body 스타일 → CSS 변수 적용
- `src/styles/calendar.css`, `App.tsx`, `BottomNav.tsx`, `StatBar.tsx`, 전체 pages raw hex 값을 토큰명(`text-text-sub`, `border-border`, `hover:bg-purple-dark` 등)으로 교체
- 이후 코드베이스 전체에서 raw hex 없이 토큰으로만 색상 관리

---

### e2e 테스트 도입 + 버그 수정 + 스타일 토큰 정리

- Playwright 설치 및 `playwright.config.ts` 구성 (webServer 자동 기동, baseURL)
- `e2e/calendar.spec.ts` — 9개 케이스 작성 및 전체 통과 확인
- BUG-01 수정: `CalendarView.toDateStr` — UTC 기반 `.toISOString()` → 로컬 날짜 `getFullYear/Month/Date()`로 변경. 한국(UTC+9) 환경에서 오늘 날짜 비교 실패 가능성 제거
- BUG-02 수정: hover 선택자 `.react-calendar__tile:hover` → `.react-calendar__tile:enabled:hover`. specificity를 0,2,0 → 0,3,0으로 올려 react-calendar 기본 CSS와 동일 수준으로 맞춤. `!important` 없이 document 순서(body > head)로 우선순위 확보
- `CalendarView` `<style>` 블록 hex 값 전체를 `var(--color-*)` CSS 변수로 교체
- JSX 인라인 클래스 `bg-[#12121a]` → `bg-bg-card`, `bg-[#534ab7]` → `bg-purple-primary` 토큰명 적용
- `CalendarView` 인라인 `<style>` 블록 → `src/styles/calendar.css`로 분리 (`src/styles/` 디렉토리 신설)

---

### CalendarView hover UI 개선

- `src/pages/CalendarView.tsx` hover 스타일 변경: 배경 `#1e1e2e` → `#181826`, 날짜 텍스트 `#afa9ec` 포인트 컬러, inset box-shadow 퍼플 포인트 보더 추가
- `src/vite-env.d.ts` 신규 생성 — `/// <reference types="vite/client" />` 추가로 CSS 사이드이펙트 임포트 TS 에러(2882) 해소

---

### TypeScript 마이그레이션

- TypeScript, @typescript-eslint 설치 / `tsconfig.json` (strict) 생성
- `src/types.ts` 신규 — Stats, PatchEntry, PatchFormData, Character, SkillData, Skills, PatchRecord 공용 타입 정의
- `src/lib/storage.ts` — 전체 함수에 파라미터·반환 타입 명시
- `src/lib/stats.ts` — 각 calc 함수, getStatusTags, StatusTagsParams 인터페이스 타입 추가
- `src/store/useStore.ts` — StoreState 인터페이스 정의, Zustand create<StoreState> 적용
- 컴포넌트: `StatBar.tsx` (StatBarProps), `BottomNav.tsx` (Tab 인터페이스)
- 페이지: `CharacterSheet.tsx` (StatConfig, SkillConfig), `DailyLog.tsx` (CounterProps, TabButtonsProps, SectionProps), `PatchResult.tsx` (StatConfig, useParams 제네릭), `CalendarView.tsx`, `Settings.tsx` 전체 타입 명시
- `vite.config.ts` 변환, `eslint.config.js` TypeScript 파서 적용
- 구 `.js/.jsx` 파일 전체 삭제

---

### 지출 규모 UI 개선

- `src/pages/DailyLog.jsx` — 지출 규모 입력 UI를 탭 버튼(인덱스 0~3)에서 금액 칩 누적 합산 방식으로 교체. 칩: 1천/5천/1만/3만/5만/10만/+직접입력. 합계 실시간 표시, 초기화 버튼 조건부 노출
- `src/lib/stats.js` — `calcWallet`, `getStatusTags` spend 파라미터를 인덱스 → 실제 금액(원 단위)으로 처리하도록 수정. 통장출혈 기준: `>= 30000`
- `src/pages/PatchResult.jsx` — `formatSpend()` 추가, 지출 표시를 만원/천원 한국어 단위로 변환
- `PRD.md` — 지출 규모 입력 스펙, 데이터 구조(`spend` 필드), 로직 예시 업데이트
- `docs/DESIGN.md` — 금액 누적 칩 컴포넌트 패턴 추가

---

### Phase 1 MVP 구현

**라우팅 & 레이아웃**
- `src/App.jsx` — React Router v6 라우팅 설정 (/, /daily, /result/:date, /calendar, /analysis, /settings)
- `src/components/BottomNav.jsx` — 하단 탭바 (캐릭터/패치노트/캘린더/분석, NavLink active 스타일)

**공통 컴포넌트**
- `src/components/StatBar.jsx` — 8칸 블록 형태 능력치 바 (70↑ teal, 40↑ amber, 39↓ coral)

**페이지**
- `src/pages/CharacterSheet.jsx` — 홈 화면. 캐릭터 프로필, 레벨(나이)/경험치바, 상태태그, 최근 7일 평균 스탯, 특수스킬 4종 진행도 표시
- `src/pages/DailyLog.jsx` — 패치노트 입력. 수면 슬라이더(0~12h, step 0.5), 식사 탭버튼(5단계), 카페/배달 카운터, 지출 탭버튼(4단계), 감정 이모지 그리드(8종), 한 줄 메모
- `src/pages/PatchResult.jsx` — 결과 카드. 날짜/이모지 헤더, 능력치 StatBar 6종, 상태태그, 메모, 랜덤 응원메시지, 기록 요약
- `src/pages/CalendarView.jsx` — react-calendar 다크 테마 커스텀, 기록된 날 이모지 표시, 클릭 → 결과카드 이동
- `src/pages/Analysis.jsx` — Phase 3 예약 스텁
- `src/pages/Settings.jsx` — 캐릭터명/클래스(프리셋+직접입력)/출생연도 설정, localStorage 저장

**정리**
- Vite 기본 보일러플레이트 제거 (App.css, src/assets/)
- dev 서버 기동 확인 (http://localhost:5174)

---

### 프로젝트 초기 세팅 (Phase 1 시작)

- Vite + React 프로젝트 생성
- 의존성 설치: Tailwind CSS v4, Zustand, React Router v6, react-calendar, Recharts
- 디자인 시스템 적용: `src/index.css` (다크모드 전용, 모노스페이스 폰트, PRD 컬러 팔레트)
- 핵심 로직:
  - `src/lib/stats.js` — HP, 집중력, 사회성, 지갑, 외출의지, 수면질, 상태태그, 특수스킬 계산
  - `src/lib/storage.js` — localStorage 저장/불러오기 헬퍼
  - `src/store/useStore.js` — Zustand 전역 상태 스토어
- 문서 체계 구성: `docs/CLAUDE.md`, `docs/DESIGN.md`, `docs/WORK.md`, `docs/HISTORY.md`, `docs/CHANGELOG.md`
