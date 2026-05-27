# WORK.md — 현재 작업 현황

## 현재 Phase: Phase 4 완료 / Phase 5 대기

---

## 완료된 작업

### [2026-05-17] 프로젝트 초기 세팅 + Phase 1 MVP 구현

**완료된 항목:**
- [x] Vite + React 프로젝트 생성
- [x] Tailwind CSS v4 (`@tailwindcss/vite`) 설치 및 설정
- [x] Zustand, React Router v6, react-calendar, Recharts 설치
- [x] `src/index.css` — 디자인 시스템 컬러 변수 및 기본 스타일
- [x] `src/lib/stats.js` — 능력치 계산 로직 (HP, 집중력, 사회성, 지갑, 외출의지, 수면질, 상태태그, 특수스킬)
- [x] `src/lib/storage.js` — localStorage 헬퍼
- [x] `src/store/useStore.js` — Zustand 전역 스토어
- [x] `src/App.jsx` — React Router v6 라우팅 설정
- [x] `src/components/BottomNav.jsx` — 하단 탭 네비게이션 (캐릭터/패치노트/캘린더/분석)
- [x] `src/components/StatBar.jsx` — 능력치 블록 바 컴포넌트
- [x] `src/pages/CharacterSheet.jsx` — 캐릭터 시트 홈 (스탯 평균, 특수스킬, 레벨 표시)
- [x] `src/pages/DailyLog.jsx` — 패치노트 입력 화면 (수면/식사/카페/배달/지출/감정/메모)
- [x] `src/pages/PatchResult.jsx` — 패치노트 결과 카드 (능력치 바, 상태태그, 응원메시지)
- [x] `src/pages/CalendarView.jsx` — 월간 캘린더 뷰 (날짜 이모지 표시, 클릭 → 결과카드)
- [x] `src/pages/Analysis.jsx` — 분석 페이지 스텁 (Phase 3 예약)
- [x] `src/pages/Settings.jsx` — 설정 페이지 (캐릭터명/클래스/출생연도)
- [x] Vite 보일러플레이트 정리 (App.css, assets 폴더 제거)
- [x] dev 서버 정상 기동 확인 (http://localhost:5174)
- [x] `docs/` 문서 체계 구성 (CLAUDE.md, DESIGN.md, WORK.md, HISTORY.md, CHANGELOG.md)

---

### [2026-05-17] TypeScript 마이그레이션

**완료된 항목:**
- [x] TypeScript, @typescript-eslint 설치
- [x] `tsconfig.json` 생성 (strict 모드)
- [x] `src/types.ts` — 공용 타입 정의 (Stats, PatchEntry, PatchFormData, Character, Skills 등)
- [x] `src/lib/storage.js` → `storage.ts` (타입 추가)
- [x] `src/lib/stats.js` → `stats.ts` (타입 추가)
- [x] `src/store/useStore.js` → `useStore.ts` (StoreState 인터페이스 정의)
- [x] 컴포넌트/페이지 전체 `.jsx` → `.tsx` 변환 (props 타입 명시)
- [x] `vite.config.js` → `vite.config.ts`
- [x] `eslint.config.js` TypeScript 파서 적용
- [x] `index.html` 엔트리 포인트 `main.jsx` → `main.tsx`
- [x] PRD.md, CLAUDE.md, docs 전체 스택 정보 업데이트

---

### [2026-05-17] 지출 규모 UI 개선

**완료된 항목:**
- [x] 지출 규모 입력 방식 변경: 탭 버튼(인덱스) → 금액 칩 누적 합산 UI
- [x] 칩 단위: 1천 / 5천 / 1만 / 3만 / 5만 / 10만 / +직접입력
- [x] 합계 실시간 표시 (섹션 레이블), 초기화 버튼 (지출 > 0 시 노출)
- [x] `stats.js` — spend 인덱스 → 실제 금액(원) 기반 calcWallet, getStatusTags 수정
- [x] `PatchResult.jsx` — formatSpend 함수 추가, 만원/천원 단위 한국어 표시
- [x] `PRD.md` — 지출 규모 UI 스펙, 데이터 구조, 로직 예시 업데이트

---

---

### [2026-05-17] CalendarView hover UI 개선

**완료된 항목:**
- [x] 캘린더 날짜 타일 hover 시 배경 미세하게 밝게 (#12121a → #181826)
- [x] hover 시 날짜 텍스트에 포인트 컬러 (#afa9ec) 적용
- [x] hover 시 inset box-shadow로 퍼플 포인트 보더 추가 (인접 셀 영향 없음)
- [x] 전체적으로 hover가 튀지 않는 절제된 피드백으로 변경

---

---

### [2026-05-17] e2e 테스트 도입 + 버그 수정 + 스타일 토큰 정리

**완료된 항목:**
- [x] Playwright 설치 (`@playwright/test`), `playwright.config.ts` 구성 (baseURL, webServer 자동 기동)
- [x] `e2e/calendar.spec.ts` 작성 — 기본 렌더링, hover 스타일, 날짜 클릭 인터랙션 총 9개 케이스
- [x] BUG-01 수정 — `toDateStr` UTC → 로컬 날짜(`getFullYear/Month/Date`) 변경
- [x] BUG-02 수정 — hover 선택자 `.react-calendar__tile:hover` → `.react-calendar__tile:enabled:hover` (`!important` 없이 specificity로 해결)
- [x] `<style>` 블록 hex 값 → `var(--color-*)` CSS 변수로 교체
- [x] JSX 인라인 클래스 → 토큰명(`bg-bg-card`, `bg-purple-primary`) 적용
- [x] e2e 테스트 9/9 전체 통과 확인
- [x] CalendarView 인라인 `<style>` 블록 → `src/styles/calendar.css`로 분리

---

### [2026-05-17] 공통 CSS 토큰 정리 — 전체 파일 적용

**완료된 항목:**
- [x] `index.css` `@theme`에 4개 토큰 추가: `--color-text-base`, `--color-text-sub`, `--color-border`, `--color-purple-dark`
- [x] `index.css` body 스타일 → `var(--color-*)` 변수 적용
- [x] `src/styles/calendar.css` 잔여 hex 값 전체 토큰 변수로 교체
- [x] `src/App.tsx`, `src/components/BottomNav.tsx`, `src/components/StatBar.tsx` 토큰 적용
- [x] `src/pages/` 전체(Analysis, CharacterSheet, PatchResult, Settings, DailyLog, CalendarView) 토큰 적용
- [x] e2e 테스트 9/9 통과 확인

---

### [2026-05-25] Phase 2 — 만렙 달성 토스트 이펙트

**완료된 항목:**
- [x] `src/lib/storage.ts` — `loadMaxedSkills()`, `saveMaxedSkills()` 추가 (`skill_maxed` 키)
- [x] `src/components/Toast.tsx` — 공용 토스트 컴포넌트 신설 (`onClose` `useRef` 패턴으로 무한루프 방지)
- [x] `src/pages/PatchResult.tsx` — 만렙 감지 + 토스트 큐 로직 추가, `fromSave` 플래그 기반 트리거, `SKILL_META` 타입 `Record<keyof Skills, ...>`로 보강
- [x] `src/pages/DailyLog.tsx` — 저장 후 `navigate(`/result/${date}`, { state: { fromSave: true } })` 추가

---

### [2026-05-17] Phase 1 마무리 — UTC 버그 수정 + e2e 전체 확장

**완료된 항목:**
- [x] BUG-03 수정 — `DailyLog.tsx` / `CharacterSheet.tsx` `today()` UTC → 로컬 날짜 변환
- [x] BUG-04 수정 — `DailyLog.tsx` / `PatchResult.tsx` `formatDateLabel`, `isMonday`/`isWeekend` 날짜 파싱 로컬 기준(`T00:00:00`)으로 수정
- [x] 오늘 날짜 기록 있을 때 DailyLog 초기값 정상 로드 확인 (e2e 검증 포함)
- [x] `e2e/character-sheet.spec.ts` 추가 — 기본 렌더링, 네비게이션, 기록 있을 때 총 6개 케이스
- [x] `e2e/daily-log.spec.ts` 추가 — 기본 렌더링, 인터랙션, 기존 기록 초기값 로드 총 8개 케이스
- [x] `e2e/patch-result.spec.ts` 추가 — 기록 없을 때/있을 때 총 8개 케이스
- [x] e2e 테스트 35/35 전체 통과 확인

---

## 다음 작업 (Phase 1.5 — 온보딩 + 개인 기준값)

- [x] `src/types.ts` — `Baseline` 인터페이스 추가
- [x] `src/lib/storage.ts` — `loadBaseline()`, `saveBaseline()` 추가 (`baseline` 키, DEFAULT_BASELINE fallback)
- [x] `src/lib/stats.ts` — `calcHP`, `calcFocus`, `calcSleepQ`, `getStatusTags` 함수에 `baseline` 인자 추가 (없으면 DEFAULT_BASELINE fallback)
- [x] `src/pages/Onboarding.tsx` 신규 — 3단계 필수 + Step 4 선택(건너뛰기)
  - Step 1: 캐릭터명 입력
  - Step 2: 클래스 선택 (탭 6종 + 직접 입력)
  - Step 3: 출생연도 입력
  - Step 4: sleepGoal 슬라이더 / cafeMax 카운터 / spendThreshold 칩 선택
  - 완료 시 character + baseline 저장, `onboarding_done` 플래그 저장 → `/` 이동
- [x] `src/App.tsx` — 진입 시 `onboarding_done` 키 없으면 `/onboarding` 리다이렉트
- [x] `src/pages/Settings.tsx` — 개인 기준값 설정 섹션 추가 (sleepGoal / cafeMax / spendThreshold)
- [x] `src/store/useStore.ts` — baseline 상태 + loadBaseline/saveBaseline 액션 추가

---

## 코드 리뷰 수정 사항 (2026-05-26)

> Phase 1.5 구현 코드에 대한 리뷰에서 식별된 항목.

### BLOCK — 즉시 수정 필요

- [x] **`src/App.tsx` AppShell** — `isOnboardingDone()` 체크가 매 렌더 시 localStorage 직접 읽기. 온보딩 완료 후 `navigate('/')` 타이밍에 재리다이렉트 위험. React state로 전환 필요
- [x] **`src/lib/stats.ts` `calcWallet`** — `spend <= 0` 분기가 음수 입력을 패널티 없이 통과. PRD 스펙(`spend > 0` 조건)과 불일치. `spend > 0` 조건으로 수정
- [x] **`src/pages/Onboarding.tsx` `handleComplete`** — `birthYear`가 `''` 상태일 때 `Number('')`=0 이 저장될 수 있음. `birthYear !== ''` guard 추가

### WARN — 수정 권장

- [x] **`src/components/BaselineForm.tsx`** — 로컬 `formatSpend` 함수가 `stats.ts`의 동일 함수와 중복. `stats.ts`에서 import하거나 인라인 표현식으로 대체
- [x] **`src/pages/Onboarding.tsx` + `src/pages/Settings.tsx`** — `CLASS_OPTIONS` 배열이 두 파일에 중복 선언. 공통 위치로 추출 검토
- [x] **`src/pages/Onboarding.tsx`** — `hover:bg-[#4340a0]` 하드코딩 → `hover:bg-purple-dark` 토큰으로 통일
- [x] **`src/store/useStore.ts`** — `loadAllPatches()` 이중 호출 → 변수에 담아 재사용

---

## 다음 작업 (Phase 1 마무리)

- [x] 실제 브라우저 UI 확인 및 레이아웃 이슈 수정 (e2e 35/35 통과로 대체 검증)
- [x] 오늘 날짜 이미 기록 있을 때 DailyLog 초기값 정상 로드 확인

---

### [2026-05-25] Phase 2 — 특수스킬 상세 모달

**완료된 항목:**
- [x] `src/components/SkillModal.tsx` — 바텀 시트 스타일 모달 신설 (아이콘/이름/설명, Lv/10, 10칸 프로그레스바, 만렙 조건 박스, 현재 달성/남은 수, 만렙 시 특별 메시지)
- [x] `src/pages/CharacterSheet.tsx` — `SKILLS` 배열에 `description`/`condition` 필드 추가, 스킬 행 → `<button>` 변환 (클릭 시 모달 오픈), `selectedSkill` state + SkillModal 렌더링
- [x] `text-status-good` → `text-success`, `bg-status-good` → `bg-success` 잘못된 토큰 수정

---

## 대기 중인 작업 (다음 Phase)

### Phase 2
- [x] 특수스킬 만렙 달성 토스트 이펙트
- [x] 특수스킬 상세 모달

### Phase 3
- [x] 주간/월간 리포트 화면
- [x] Recharts 스탯 그래프

### [2026-05-25] Phase 2 후속 — 리뷰 수정사항 + 테스트 추가

**완료된 항목:**
- [x] `storage.ts` — `loadPatch`, `loadAllPatches`의 `JSON.parse`에 try-catch 추가 (손상 데이터로 인한 앱 크래시 방지)
- [x] `PatchResult.tsx` — useState 초기화 함수 내 `saveMaxedSkills`(localStorage 쓰기) 제거, `useMemo`(순수 계산) + `useEffect`(쓰기) 분리
- [x] `CharacterSheet.tsx` — `getStatusTags` 호출 시 `new Date().getDay()` → `new Date(todayPatch.date + 'T00:00:00').getDay()`로 변경
- [x] `types.ts` — `SkillConfig` 인터페이스 추가, `key` 타입 `keyof Skills`로 지정. `SkillModal.tsx`, `CharacterSheet.tsx` import 경로 통일
- [x] `stats.ts` — `formatSpend` 조건식 `!amount || amount === 0` → `amount <= 0` 정리
- [x] `src/lib/stats.test.ts` — vitest 단위 테스트 67개 추가 (calcHP/Focus/Social/Wallet/Outdoor/SleepQ/getStatusTags/formatSpend/calcStats)
- [x] `src/lib/storage.test.ts` — vitest 단위 테스트 14개 추가 (loadPatch/loadAllPatches 손상 JSON 방어 포함)
- [x] `e2e/patch-result.spec.ts` — fromSave 토스트 표시/미표시/큐 순차 케이스 3개 추가 (총 38개)
- [x] BUG-05 수정 — `calcWallet` spend=0일 때 `-20` 패널티가 적용되던 버그. `spend <= 0`이면 spend 패널티 없음 (wallet 100 유지)

**미완료 (다음으로 이월):**
- [x] `PatchResult.tsx` — loadMaxedSkills/saveMaxedSkills 직접 호출 → useStore 액션으로 감싸기

---

### [2026-05-25] Phase 3 — 분석 화면 구현

**완료된 항목:**
- [x] `src/pages/Analysis.tsx` — 주간/월간 탭 전환, 빈 상태 처리, useMemo로 리포트·차트 데이터 계산
- [x] `src/components/WeeklyReportCard.tsx` — 주간 리포트 카드 (출석 현황, MVP/위험 스탯, 스킬 성장, verdict 배지)
- [x] `src/components/MonthlyReportCard.tsx` — 월간 리포트 카드 (평균 수면, 총 지출, 최고/최저일, 예측 메시지)
- [x] `src/components/StatTrendChart.tsx` — Recharts LineChart (hp/focus/wallet 트렌드), `STAT_TREND_COLORS` export
- [x] `src/components/SkillBarChart.tsx` — Recharts BarChart (4스킬 레벨)
- [x] `src/components/AnalysisTabBar.tsx` — 주간/월간 탭 컴포넌트
- [x] `src/lib/date.ts` — `today()`, `getWeekDateRange()` 신규 (CharacterSheet·DailyLog 중복 제거)
- [x] `src/lib/stats.ts` — `getWeekBounds`, `getMonthBounds`, `calcWeeklyReport`, `calcMonthlyReport`, `calcStatTrend` 추가
- [x] BLOCK-1: `calcWeeklyReport` — mvpStat === dangerStat 케이스 → `finalDangerStat = null` 처리
- [x] BLOCK-2: `calcWeeklyReport` — skillsAfter 범위를 weekEntries만으로 제한
- [x] WARN-1: `getWeekDateRange` 사용으로 날짜 범위 생성 일관성 확보
- [x] WARN-2: `PatchResult.tsx` — `useStore.getState()` → `useStore((s) => s.skills)` 구독 방식으로 변경
- [x] WARN-3: `PatchResult.tsx` — skills를 useMemo deps에 추가
- [x] WARN-4: `calcMonthlyReport` — dayStats 불필요한 sort 제거
- [x] WARN-5: `StatTrendChart.tsx` — 인라인 hex → `STAT_TREND_COLORS` import로 통일
- [x] `src/lib/analysis.test.ts` — vitest 단위 테스트 58개 추가
- [x] `e2e/analysis.spec.ts` — e2e 테스트 13개 추가

### Phase 4
- [x] 날씨 API 연동 (OpenWeatherMap Current Weather)
- [x] 미세먼지 API 연동 (OpenWeatherMap Air Pollution, 에어코리아 대신)
- [x] 공휴일 정적 데이터 (정적 배열, 공공데이터포털 API 대신)
- [x] 카드 이미지 저장/공유 (html-to-image + Web Share API)
- [x] 반응형 모바일 UI 점검 (safe-area, 터치 타겟)
- [x] Vercel 배포 (vercel.json SPA rewrites 포함)

---

### [2026-05-25] Phase 4 — 완성도

**완료된 항목:**
- [x] `src/hooks/useWeather.ts` — 날씨/미세먼지 훅 구현 (위치 거부 시 서울 fallback, AbortController 타임아웃)
- [x] `src/lib/holidays.ts` — 2025/2026년 공휴일 정적 Set + isHoliday(dateStr): boolean
- [x] `src/types.ts` — PatchEntry weather/aqi optional 필드 추가
- [x] `src/lib/stats.ts` — isWeekend에 isHoliday 통합 (공휴일 → HP +15, Social +10 보너스)
- [x] `src/store/useStore.ts` — savePatchEntry tags: [] 하드코딩 → getStatusTags 결과로 수정
- [x] `src/pages/DailyLog.tsx` — useWeather 훅 호출, isHoliday 호출, Pill 배지 렌더링, 저장 시 weather/aqi 포함, Counter 터치타겟 min-w-11 min-h-11
- [x] `src/pages/PatchResult.tsx` — 결과 카드 내 공유 아이콘 버튼 추가 (html-to-image + Web Share API), 캡처 실패 시 Toast 피드백, isHoliday 통합
- [x] `src/components/BottomNav.tsx` — safe-area-inset-bottom 인라인 스타일 추가
- [x] `index.html` — viewport-fit=cover 추가, lang="ko" 변경
- [x] `vercel.json` — SPA rewrites 설정
- [x] `src/lib/holidays.test.ts` — vitest 단위 테스트 11개 신규
- [x] `src/lib/stats.test.ts` — 공휴일 통합 테스트 7개 추가 (전체 157개 통과)
- [x] `e2e/daily-log.spec.ts` — 날씨 API 키 없을 때 Pill 미표시 케이스 추가

---

## 코드 리뷰 수정 사항 (완료)

> 2026-05-25 코드 리뷰에서 식별된 항목.

### BLOCK — 즉시 수정 필요

- [x] **`src/pages/PatchResult.tsx` L133-140** — `getStatusTags` 재계산 제거, `patch.tags` 직접 사용으로 변경
  - 저장된 태그와 렌더링 시 재계산 태그가 불일치할 수 있음 (isHoliday 미전달 등)

- [x] **`src/pages/CharacterSheet.tsx` L66-75** — `getStatusTags` 재계산 제거, `todayPatch.tags` 직접 사용으로 변경
  - 실제 버그: 공휴일(평일)에 작성한 패치노트의 태그가 저장 시와 다르게 표시됨 (isHoliday 누락)

### WARN — 수정 권장

- [x] **`src/lib/storage.ts` L44-47** — `loadCharacter` JSON.parse에 try-catch 추가
  - 손상된 character 데이터 시 앱 진입 화이트스크린 가능. `storage.test.ts`에 방어 테스트 함께 추가

- [x] **`src/pages/PatchResult.tsx` L93, L108** — `loadMaxedSkills`/`saveMaxedSkills` 직접 import 제거
  - 책임 분리 위반. useStore에 skill_maxed 관련 상태·액션 추가 후 컴포넌트에서 스토어 액션 사용 (이전 이월 항목과 동일)

- [x] **`src/styles/calendar.css` L66** — `#181826` 하드코딩 컬러를 토큰으로 교체
  - DESIGN.md 팔레트에 미등록된 임의 컬러. `var(--color-bg-input)` 등 인접 토큰으로 대체 또는 `@theme`에 등록

- [x] **`src/pages/PatchResult.tsx` / `src/pages/CharacterSheet.tsx`** — `StatConfig` 인터페이스 중복 정의 제거
  - `src/types.ts`로 통합 후 각 파일에서 import

- [x] **`src/pages/DailyLog.tsx` / `src/pages/PatchResult.tsx`** — `formatDateLabel` 함수 중복 제거
  - `src/lib/date.ts`로 이동 후 import

---

### [2026-05-25] 캘린더에서 과거 날짜 패치노트 작성 기능

**완료된 항목:**
- [x] `src/App.tsx` — `/daily/:date` 동적 라우트 추가 (기존 `/daily` 유지)
- [x] `src/pages/DailyLog.tsx` — `useParams`로 날짜 수신, `isToday`/`isFuture` 분기 처리. 과거 날짜 시 날씨/공기질 미저장, 미래 날짜 저장 비활성화
- [x] `src/pages/CalendarView.tsx` — 기록 없는 과거/오늘 날짜에 "패치노트 작성하기" 버튼 표시. 미래 날짜는 안내 텍스트만 표시. `today()` import로 날짜 비교 통일
- [x] `src/pages/PatchResult.tsx` — "수정하기" 버튼 경로를 `/daily/${date}`로 수정

---

### [2026-05-25] 코드 리뷰 수정사항 반영

**완료된 항목:**
- [x] `src/pages/PatchResult.tsx` — `getStatusTags` 재계산 블록 제거, `patch.tags` 직접 사용. `isHoliday`/`getStatusTags` import 제거
- [x] `src/pages/CharacterSheet.tsx` — `getStatusTags` 재계산 블록 제거, `todayPatch?.tags ?? []` 직접 사용. `getStatusTags` import 제거
- [x] `src/lib/storage.ts` — `loadCharacter` JSON.parse에 try-catch 추가, 기본값 반환
- [x] `src/lib/storage.test.ts` — 손상된 JSON / 빈 localStorage 방어 테스트 추가 (총 159개 통과)
- [x] `src/store/useStore.ts` — `getMaxedSkills()`, `markSkillsMaxed(keys)` 액션 추가
- [x] `src/pages/PatchResult.tsx` — `loadMaxedSkills`/`saveMaxedSkills` 직접 import 제거, useStore 액션으로 교체
- [x] `src/styles/calendar.css` — `#181826` 하드코딩 → `var(--color-bg-input)` 토큰으로 교체
- [x] `src/types.ts` — `StatConfig` 인터페이스 export 추가
- [x] `src/pages/PatchResult.tsx`, `src/pages/CharacterSheet.tsx` — 로컬 `StatConfig` 선언 제거, `types.ts` import로 통일
- [x] `src/lib/date.ts` — `formatDateLabel` 함수 export 추가
- [x] `src/pages/PatchResult.tsx`, `src/pages/DailyLog.tsx` — 로컬 `formatDateLabel` 제거, `date.ts` import로 통일

---

### [2026-05-26] Phase 1.5 — 온보딩 + 개인 기준값

**완료된 항목:**
- [x] `src/pages/Onboarding.tsx` (신규) — 4단계 온보딩. Step 1~3 필수 (이름/클래스/출생연도), Step 4 선택 (기준값, 건너뛰기 시 DEFAULT_BASELINE 저장). 완료 시 `onboarding_done` 플래그 저장 → `/` 이동
- [x] `src/components/BaselineForm.tsx` (신규) — 개인 기준값 입력 폼 재사용 컴포넌트 (sleepGoal 슬라이더, cafeMax 카운터, spendThreshold 칩 선택)
- [x] `src/types.ts` — `PersonalBaseline` 인터페이스, `DEFAULT_BASELINE` 상수 추가
- [x] `src/lib/storage.ts` — `saveBaseline`, `loadBaseline`, `isOnboardingDone`, `setOnboardingDone` 추가
- [x] `src/lib/stats.ts` — `calcHP`, `calcFocus`, `calcSleepQ`, `getStatusTags`, `calcStats`에 `baseline?` 인자 추가. `calcWallet` PRD 스펙 수정 (spend > 0 조건)
- [x] `src/store/useStore.ts` — `baseline` 상태 및 `setBaseline` 액션 추가
- [x] `src/pages/Settings.tsx` — 개인 기준값 섹션 추가, `CLASS_OPTIONS` export
- [x] `src/App.tsx` — 온보딩 라우트 가드 (onboarding_done 없으면 /onboarding 리다이렉트), BottomNav 조건부 숨김

**코드 리뷰 수정사항 (BLOCK/WARN) 반영:**
- [x] `src/App.tsx` — `isOnboardingDone()` 매 렌더 호출 → React state로 전환 (BLOCK)
- [x] `src/lib/stats.ts` `calcWallet` — 음수 입력 패널티 없이 통과 → `spend > 0` 조건으로 수정 (BLOCK)
- [x] `src/pages/Onboarding.tsx` `handleComplete` — `birthYear === ''` 시 0 저장 방지 guard 추가 (BLOCK)
- [x] `src/components/BaselineForm.tsx` — 중복 `formatSpend` 제거, `stats.ts` import로 대체 (WARN)
- [x] `src/pages/Settings.tsx` — `CLASS_OPTIONS` export로 Onboarding과 공유 (WARN)
- [x] `src/pages/Onboarding.tsx` — `hover:bg-[#4340a0]` → `hover:bg-purple-dark` 토큰으로 교체 (WARN)
- [x] `src/store/useStore.ts` — `loadAllPatches()` 이중 호출 → 변수에 담아 재사용 (WARN)

---

### [2026-05-26] AirKorea API 파라미터 버그 수정

**완료된 항목:**
- [x] `api/airkorea.ts` — `getStationName()` → `getSidoName()` 리네임, 반환값을 시도명으로 변경
- [x] `api/airkorea.ts` — URL 파라미터 `stationName` + `dataTerm=DAILY` → `sidoName`으로 교체 (시도별 endpoint 기준으로 정렬)

---

### [2026-05-25] 날씨/공기질 API 한국 공공 API로 전환

**완료된 항목:**
- [x] `src/lib/weather.ts` (신규) — Lambert 격자 좌표 변환, base_time 계산, 날씨/AQI 코드 매핑 로직 분리
- [x] `api/weather.ts` (신규) — 기상청 초단기실황 API Vercel Serverless Function 프록시 (`KMA_API_KEY`)
- [x] `api/airkorea.ts` (신규) — 에어코리아 API Vercel Serverless Function 프록시 (`AIRKOREA_API_KEY`)
- [x] `src/hooks/useWeather.ts` — OpenWeatherMap 호출 제거, `/api/weather`, `/api/airkorea` 내부 프록시 호출로 전환
- [x] `tsconfig.json` — `api/` 디렉터리 타입 검사 포함
- [x] `vercel.json` — `/api/*` rewrite 명시적 제외 규칙 추가
- [x] `VITE_OPENWEATHER_API_KEY` 환경변수 제거 → `KMA_API_KEY`, `AIRKOREA_API_KEY` (서버사이드) 로 대체

---

### [2026-05-26] 온보딩 지역 선택 기능 추가

날씨/공기질 데이터 정확도 개선을 위해 온보딩 플로우에 시도(지역) 선택 스텝을 추가한다.

**변경 파일:**
- [x] `src/types.ts` — `SidoName` 타입, `SidoCoord` 인터페이스 추가
- [x] `src/lib/storage.ts` — `saveRegion()`, `loadRegion()` 추가 (별도 `region` localStorage 키)
- [x] `src/lib/weather.ts` — `SIDO_LIST`, `SIDO_COORDS: Record<SidoName, SidoCoord>` 17개 시도 대표 좌표 추가
- [x] `src/store/useStore.ts` — `region: SidoName | null` 상태 및 `setRegion()` 액션 추가 (초기값 `loadRegion()`)
- [x] `src/components/SidoPicker.tsx` — 신규 생성. 17개 시도 버튼 그리드 재사용 컴포넌트
- [x] `src/pages/Onboarding.tsx` — Step 타입 `1|2|3|4|5`로 확장, Step 4(지역 선택) 삽입, 기존 Step 4(기준값)를 Step 5로 이동. `handleComplete`에서 `setRegion()` 호출
- [x] `src/pages/Settings.tsx` — 지역 선택 섹션 추가 (SidoPicker 재사용), `handleSave`에서 `setRegion()` 호출
- [x] `src/hooks/useWeather.ts` — 저장된 `region`이 있으면 `SIDO_COORDS[region]` 좌표로 직접 fetch, airkorea API에 `sidoName` 쿼리 파라미터 전달. `useEffect` 의존성 배열에 `region` 추가
- [x] `api/airkorea.ts` — `SIDO_ALLOWLIST` 추가, `sidoName` 쿼리 파라미터 직접 수신 지원 (allowlist 통과 시 우선 사용, 아니면 기존 lat/lon 기반 폴백 유지)
- [x] `eslint.config.js` — `api/**/*.ts`에 `globals.node` 별도 적용 (기존 `globals.browser`만 적용되어 `process` 미인식 에러 수정)

**결정 사항:**
- region은 `Character` 인터페이스가 아닌 별도 `region` localStorage 키로 저장
- 온보딩에서 건너뛰기 시 null 저장 → geolocation fallback 유지
- `SidoPicker` 컴포넌트를 Onboarding과 Settings 양쪽에서 재사용

---

### [2026-05-26] 날씨 렌더링 버그·경고 수정

**완료된 항목:**
- [x] `src/lib/weather.ts` — `mapKmaWeather(pty)` 제거, `getWeatherLabel(pty, sky)` 추가 (PTY=0이면 SKY 기반으로 맑음/구름많음/흐림 반환, PTY≠0이면 강수 라벨 반환)
- [x] `src/hooks/useWeather.ts` — `mapKmaWeather` → `getWeatherLabel`로 교체. API 응답에서 PTY·SKY 카테고리 모두 추출해 `getWeatherLabel(pty, sky)` 호출. `navigator.geolocation.getCurrentPosition` 세 번째 인자에 `{ timeout: TIMEOUT_MS }` 추가 (BUG-07)
- [x] `src/pages/DailyLog.tsx` — `useWeather()`에서 `error` 상태 destructure 추가. API 전체 실패 시 "날씨 정보를 불러오지 못했습니다" 오류 메시지 UI 추가
- [x] `src/components/SidoPicker.tsx` — hex 하드코딩 컬러 → Tailwind 디자인 토큰으로 교체 (`bg-purple-primary`, `bg-bg-input`, `text-text-sub`, `hover:bg-border`)
- [x] `src/pages/Onboarding.tsx` — hex 하드코딩 컬러 전체 → Tailwind 디자인 토큰으로 교체. `isStep4Valid = true` dead code 제거 및 disable 조건에서 해당 조건 제거

---

### 버그 수정 완료 — 온보딩 완료 후 리다이렉트

**현상:** 온보딩 완료 후 `/`로 이동하지 않고 온보딩 첫 화면으로 다시 튕김

**원인:**
- `App.tsx`의 `AppShell`이 `useState(() => isOnboardingDone())`로 마운트 시 딱 한 번만 localStorage를 읽음
- `Onboarding.tsx`의 `handleComplete`가 `setOnboardingDone()`을 직접 호출해 localStorage에는 기록되지만 store의 `onboardingDone` 상태는 `false`로 남음
- `navigate('/')` 후 `AppShell`의 가드가 `onboarded = false`로 판단해 다시 `/onboarding`으로 리다이렉트

**수정 항목:**
- [x] `src/App.tsx` — `useState(() => isOnboardingDone())` 제거, `useStore(s => s.onboardingDone)` 구독으로 교체. `isOnboardingDone` import 제거
- [x] `src/pages/Onboarding.tsx` — `handleComplete`에서 `setOnboardingDone()` 직접 호출 제거, `useStore`의 `completeOnboarding()` 액션 호출로 교체. `setOnboardingDone` import 제거

**주의 사항:**
- `isOnboardingDone`을 `storage.ts`에서 삭제하지 말 것 (`useStore.ts` 초기화에서 사용 중)
- `AppShell`에서 `useStore(s => s.onboardingDone)` selector 방식 사용

---

## 다음 작업 (2026-05-26 이월 확인)

> `[2026-05-25] Phase 2 후속` 섹션의 이월 항목을 실제 코드와 대조한 결과, 아래 작업은 이미 구현 완료된 것으로 확인됨. 미완료 표시(`- [ ]`)를 완료(`- [x]`)로 수정함.

- [x] `src/pages/PatchResult.tsx` — `loadMaxedSkills` / `saveMaxedSkills` 직접 호출 → `useStore`의 `getMaxedSkills()` / `markSkillsMaxed()` 액션으로 교체 (이미 완료)
- [x] `src/store/useStore.ts` — `getMaxedSkills()`, `markSkillsMaxed(keys)` 액션 추가 (이미 완료)

---

### [2026-05-26] 분석 페이지 주간/월간 날짜 네비게이션 기능 추가

**완료된 항목:**
- [x] `src/components/PeriodNavigator.tsx` (신규) — 이전/다음 기간 이동 버튼 + 현재 기간 레이블 컴포넌트 (6 props: label/prevLabel/nextLabel/onPrev/onNext/isNextDisabled)
- [x] `src/pages/Analysis.tsx` — `weekBaseDate` / `monthBaseDate` 로컬 state 추가, PeriodNavigator 연결, useMemo 의존성 변경, 스탯 트렌드 레이블 동적 반영

---

### [2026-05-26] 온보딩 게임 스타일 랜딩 화면 추가

**브랜치:** `feat/onboarding-landing-screen`

**작업 범위:**
- [x] `react-type-animation` 패키지 설치
- [x] `src/pages/Onboarding.tsx` — `Step` 타입 `0 | 1 | 2 | 3 | 4 | 5`로 확장, `useState<Step>(0)` 초기값 변경
- [x] step === 0: 게임 터미널 스타일 랜딩 화면 (타이핑 애니메이션 3줄 + "[Y] 캐릭터 만들기" 버튼)
- [x] step 1 이전 버튼 클릭 → step 0 복귀 (`goPrev` 조건 `step > 0`으로 변경)
- [x] 스텝 인디케이터(dot)는 `step > 0`일 때만 표시

---

### [2026-05-27] 캘린더 게임 터미널 스타일 재작성

**브랜치:** `feat/calendar-terminal-style`

**완료된 항목:**
- [x] `src/styles/calendar.css` — 요일 헤더 및 날짜 그리드에 border-left+top(컨테이너) / border-right+bottom(셀) 조합으로 터미널 테이블 격자 구현
- [x] 오늘 날짜: `box-shadow: inset 0 0 0 1px #5dcaa5` 초록 테두리
- [x] 선택된 날짜: `box-shadow: inset 0 0 0 1px #534ab7` + 퍼플 반투명 배경
- [x] 패치 기록 있는 날(`.has-patch`): 퍼플 tint 배경 + `::after` 하단 2px 퍼플 바
- [x] 네비게이션: `#0f0f13` 배경, hover 시 `#1e1e2e` 하이라이트
- [x] 이웃 달 날짜: `#2a2a3a` dim 처리, `has-patch::after` 바 숨김

---

### [2026-05-26] maxedSkills Zustand 반응형 상태 통합

**완료된 항목:**
- [x] `src/store/useStore.ts` — `StoreState` 인터페이스에 `maxedSkills: string[]` 필드 추가. 초기값 `loadMaxedSkills()`. `getMaxedSkills()` 액션 제거. `markSkillsMaxed` 액션에 `set({ maxedSkills: merged })` 반응형 갱신 추가
- [x] `src/pages/PatchResult.tsx` — `getMaxedSkills()` 함수 호출 → `useStore(s => s.maxedSkills)` 셀렉터 구독으로 교체. `useMemo` 의존성 배열에서 `getMaxedSkills` 제거, `maxedSkills` 추가

---

## 다음 작업 (Phase 5)

### Phase 5-1: Landing Page 분리

**결정 사항:**
- 앱을 열 때마다 `/landing`을 거침 (매번 거침, 옵션 A)
- "현생 로그인" 버튼 클릭 후 `navigate('/', { replace: true })` — 히스토리 스택에서 /landing 제거
- /에서 /landing으로 리다이렉트 루프 방지: 세션 내 `hasLanded` 플래그(`sessionStorage`) 사용

**변경 파일:**
- [x] `src/pages/Landing.tsx` (신규) — `useStore(s => s.character)`, `useStore(s => s.patches)` 구독. `level = new Date().getFullYear() - character.birthYear`, `patchCount = Object.keys(patches).length`. TypeAnimation 시퀀스: `> LOADING SAVE DATA...` → `> PLAYER FOUND: {이름} (LV.{레벨}) — 기록 {N}개 확인` → `> PRESS [Y] TO CONTINUE`. "현생 로그인" 버튼: `navigate('/', { replace: true })` + `sessionStorage.setItem('has_landed', '1')`. BottomNav 없음. Onboarding step 0 레이아웃 패턴 참고 (`min-h-svh bg-bg-root flex flex-col items-center justify-center font-mono`, 최대 430px)
- [x] `src/App.tsx` — `Landing` import 추가. `<Route path="/landing" element={<Landing />} />` 추가. BottomNav 숨김 조건에 `/landing` 추가. 가드 분기 수정: `onboarded && !hasLanded && pathname === '/'` → `/landing`으로 리다이렉트. `hasLanded = sessionStorage.getItem('has_landed') === '1'`

### Phase 5-2: 설정 About 섹션

**변경 파일:**
- [x] `src/pages/Settings.tsx` — return 블록 내 최하단에 About 섹션 카드 추가. 기존 섹션 패턴 동일: `bg-bg-card border border-border rounded-lg p-4`. 섹션 레이블: `text-purple-light text-xs font-mono font-bold` + "ABOUT". 내용: 앱 버전 `v1.0.0`, 창작자 정보 정적 텍스트. `text-text-sub text-[13px] font-mono` 스타일

---

### [2026-05-27] Phase 5 — Landing 페이지 + Settings About 섹션

**완료된 항목:**
- [x] `src/pages/Landing.tsx` (신규) — 터미널 스타일 로그인 화면. TypeAnimation 3단계 시퀀스 (LOADING → PLAYER FOUND → PRESS [Y]). 캐릭터명/레벨/기록 수 동적 표시. "현생 로그인" 버튼 클릭 시 `sessionStorage` 플래그 설정 후 `/` 이동
- [x] `src/App.tsx` — Landing 라우트(`/landing`) 추가. `hasLanded` sessionStorage 기반 가드 분기. BottomNav 숨김 조건에 `/landing` 추가. `onboarded && !hasLanded && pathname === '/'` → `/landing` 리다이렉트
- [x] `src/pages/Settings.tsx` — About 섹션 카드 최하단 추가. 앱 버전 `v1.0.0`, 앱 설명, 창작자 정보 정적 텍스트

---

---

## 현재 작업 (feat/phase5-landing 코드 리뷰 수정)

> Phase 5 Landing 페이지 구현 코드 리뷰에서 식별된 항목. 구현 시작 전 상태.

### [BLOCK] 뒤로가기 버그 수정

- [ ] `src/pages/Onboarding.tsx:38` — `navigate('/')` → `navigate('/', { replace: true })` 변경
  - 온보딩 완료 후 히스토리 스택에 /onboarding이 남아 뒤로가기로 랜딩 재진입이 가능했던 문제
- [ ] `src/lib/storage.ts` — `HAS_LANDED_KEY` 상수 + `setHasLanded()` / `isHasLanded()` 헬퍼 추가
- [ ] `src/App.tsx` — `sessionStorage.getItem('has_landed')` → storage.ts 헬퍼로 교체
- [ ] `src/pages/Landing.tsx` — `sessionStorage.setItem('has_landed', '1')` → storage.ts 헬퍼로 교체

### [WARN] 스타일 일관성 수정

- [ ] `src/pages/Settings.tsx:126` — `text-[#6b7280]` → `text-text-sub`

---

### 중기 (보류 중)

- [ ] Phase 6: 캐릭터 비주얼 & 아이템 시스템 — **캐릭터 비주얼 방향 확정 후 착수** (픽셀아트 vs 이모지 미결정)

### 장기 (추후 결정)

- [ ] Phase 7: 로그인 + DB + 랭킹 세트 — 현재 localStorage로 충분, 유저 규모 커지면 재검토
