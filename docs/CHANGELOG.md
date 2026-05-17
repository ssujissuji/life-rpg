# CHANGELOG.md

형식: `[버전] 날짜 — 변경사항`

---

## [0.3.3] 2026-05-17 — 공통 CSS 토큰 전체 적용

### Added
- `index.css` `@theme`에 4개 색상 토큰 추가
  - `--color-text-base: #e2e8f0` — 기본 텍스트
  - `--color-text-sub: #6b7280` — 서브/힌트 텍스트
  - `--color-border: #2a2a3a` — 카드 테두리, 구분선
  - `--color-purple-dark: #4340a0` — 버튼 hover 퍼플 다크

### Changed
- 전체 소스 파일(`App.tsx`, `BottomNav.tsx`, `StatBar.tsx`, 모든 pages, `calendar.css`) raw hex 값을 Tailwind 토큰명 및 CSS 변수로 교체
- `index.css` body 스타일 → `var(--color-bg-root)`, `var(--color-text-base)` 적용

---

## [0.3.2] 2026-05-17 — e2e 테스트 도입 + 버그 수정 + 스타일 토큰 정리

### Added
- Playwright e2e 테스트 도입 (`@playwright/test`, `playwright.config.ts`)
- `e2e/calendar.spec.ts` — CalendarView 기본 렌더링 / hover 스타일 / 날짜 클릭 인터랙션 9개 케이스 (전체 통과)

### Fixed
- `CalendarView.toDateStr` 타임존 버그 — `toISOString()`(UTC) → `getFullYear/Month/Date()`(로컬) 변경. 한국(UTC+9)에서 오늘 날짜 비교 실패 가능성 제거
- CalendarView hover 배경색 CSS specificity 버그 — `.react-calendar__tile:hover` → `.react-calendar__tile:enabled:hover`로 변경해 react-calendar 기본 CSS(specificity 0,3,0)와 동일 수준 맞춤. `!important` 없이 해결

### Changed
- `CalendarView` `<style>` 블록 hex 값 → CSS 변수(`var(--color-*)`) 로 교체
- JSX 인라인 클래스 → 토큰명(`bg-bg-card`, `bg-purple-primary`) 적용
- `CalendarView` 인라인 `<style>` 블록 → `src/styles/calendar.css`로 분리 (`src/styles/` 디렉토리 신설)

---

## [0.3.1] 2026-05-17 — CalendarView hover UI 개선

### Changed
- `CalendarView` 캘린더 날짜 타일 hover 스타일 변경
  - 배경: `#1e1e2e` (너무 밝음) → `#181826` (미세하게 밝히기)
  - 날짜 텍스트: hover 시 포인트 컬러 `#afa9ec` 적용
  - 보더: inset box-shadow로 퍼플 계열 포인트 보더 추가 (인접 셀 영향 없음)

---

## [0.3.0] 2026-05-17 — TypeScript 마이그레이션

### Changed
- 프로젝트 전체를 JavaScript → TypeScript로 전환
  - `.jsx` → `.tsx`, `.js` → `.ts` 전체 확장자 변경
  - `vite.config.js` → `vite.config.ts`
- ESLint 설정에 `@typescript-eslint` 파서 및 플러그인 적용

### Added
- `typescript`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` devDependencies 추가
- `tsconfig.json` — strict 모드 활성화
- `src/types.ts` — 프로젝트 공용 타입 (Stats, PatchEntry, PatchFormData, Character, SkillData, Skills, PatchRecord)
- 각 컴포넌트/페이지 props 인터페이스, 함수 파라미터·반환 타입 명시

---

## [0.2.1] 2026-05-17 — 지출 규모 UI 개선

### Changed
- `DailyLog` 지출 규모 입력 방식: 탭 버튼(0원/~3만/~7만/10만+) → 금액 칩 누적 합산 (1천/5천/1만/3만/5만/10만/+직접입력)
- `stats.js` `calcWallet`, `getStatusTags` — spend 값을 인덱스 대신 실제 금액(원)으로 처리
  - 통장출혈 태그 기준: `spend >= 2` → `spend >= 30000`
- `PatchResult` 지출 표시: 인덱스 배열 참조 → `formatSpend()` 한국어 금액 포맷

### Added
- `PatchResult.formatSpend()` — 원 단위 금액을 만원/천원 한국어로 표시
- `DailyLog.formatSpend()` — 섹션 레이블 실시간 합계 표시용

---

## [0.2.0] 2026-05-17 — Phase 1 MVP 화면 구현

### Added
- React Router v6 라우팅 (`/`, `/daily`, `/result/:date`, `/calendar`, `/analysis`, `/settings`)
- `BottomNav` — 하단 탭 네비게이션 4종
- `StatBar` — 8칸 블록 능력치 바 컴포넌트 (수치에 따라 teal/amber/coral 색상)
- `CharacterSheet` — 홈 화면 (캐릭터 프로필, 레벨/경험치, 상태태그, 평균 스탯, 특수스킬 4종)
- `DailyLog` — 패치노트 입력 화면 (수면 슬라이더, 식사/지출 탭버튼, 카페/배달 카운터, 감정 이모지, 메모)
- `PatchResult` — 패치노트 결과 카드 (능력치, 상태태그, 응원메시지, 기록 요약)
- `CalendarView` — 월간 캘린더 (다크 테마, 기록일 이모지, 날짜 클릭 → 결과카드)
- `Settings` — 캐릭터 설정 (이름/클래스/출생연도)
- `Analysis` — Phase 3 예약 스텁

### Removed
- Vite 기본 보일러플레이트 (App.css, src/assets/)

---

## [0.1.0] 2026-05-17 — 프로젝트 초기 세팅

### Added
- Vite + React + Tailwind CSS v4 프로젝트 골격 구성
- Zustand 전역 스토어 (`src/store/useStore.js`)
- localStorage 헬퍼 (`src/lib/storage.js`)
- 능력치 계산 로직 (`src/lib/stats.js`): HP, 집중력, 사회성, 지갑, 외출의지, 수면질
- 상태 태그 계산 로직 (월요병, 수면부족, 커피버프 등)
- 특수스킬 레벨 계산 (돼지력, 거지력, 각성력, 숙면력)
- 다크모드 전용 디자인 시스템 (PRD 8장 기반)
- 프로젝트 문서 체계 (`docs/` 폴더)
