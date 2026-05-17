# CHANGELOG.md

형식: `[버전] 날짜 — 변경사항`

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
