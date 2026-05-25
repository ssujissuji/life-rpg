# WORK.md — 현재 작업 현황

## 현재 Phase: Phase 4 완료

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
- [ ] `PatchResult.tsx` — loadMaxedSkills/saveMaxedSkills 직접 호출 → useStore 액션으로 감싸기

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
