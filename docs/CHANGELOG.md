# CHANGELOG.md

형식: `[버전] 날짜 — 변경사항`

---

## [Unreleased] — 칭호 섹션 리디자인 + CSS 토큰 추가

### Added
- `src/index.css` — CSS 토큰 6개 추가: `--color-gold-tint`, `--color-gold-glow-soft`, `--color-gold-dim`, `--color-purple-tint`, `--color-purple-glow-soft`, `--color-purple-dim`

### Changed
- `src/pages/CharacterSheet.tsx` — 칭호 섹션을 대표 칭호 1개 표시 Panel로 교체. 우측 상단 `List` 아이콘 버튼 → TitleSelectModal 오픈. 활성 칭호 없으면 `-- 대표 칭호 미설정` 플레이스홀더 표시. rarity별 카드 스타일 분기 적용
- `src/components/TitleSelectModal.tsx` — 보유 섹션 + LOCKED 섹션(미보유 칭호) 분리 표시. 보유/미보유 모두 rarity 순(Legendary → Rare → Common) 정렬. `RARITY_ORDER` 상수 모듈 레벨로 이동. 모달 높이 `max-h-[55vh]` → `max-h-[70vh]` 확장
- `src/components/TitleBadge.tsx` — `onSelect` prop optional로 변경. 미전달 시 "선택" 버튼 미렌더링

---

## [Unreleased] — 칭호(Title) 시스템

### Added
- `src/lib/titles.ts` (신규) — `TITLE_DEFS` 10개 칭호 상수 + `checkTitleUnlocks` / `calcMaxStreak` / `calcMaxZeroSpendStreak` / `calcMaxSleepTagStreak` 순수 함수
- `src/components/TitleBadge.tsx` (신규) — 단일 칭호 배지. 획득/잠금/대표 상태 표시, 희귀도(legendary/rare/common)별 border·glow 스타일 분기
- `src/components/TitleSelectModal.tsx` (신규) — 대표 칭호 선택 바텀시트 모달
- `src/types.ts` — `TitleRarity` 유니온 타입, `TitleDef` 인터페이스 추가
- `src/lib/storage.ts` — `loadUnlockedTitles` / `saveUnlockedTitles` / `loadActiveTitle` / `saveActiveTitle` 추가 (`unlocked_titles`, `active_title` localStorage 키)
- `src/store/useStore.ts` — `unlockedTitles: string[]`, `activeTitle: string | null` 상태 추가. `markTitlesUnlocked`, `setActiveTitle` 액션 추가. 앱 초기화 시 전체 패치 기록 기반 retroactive unlock 실행

### Changed
- `src/pages/CharacterSheet.tsx` — 프로필 캐릭터명 아래 대표 칭호 표시 영역 추가. 칭호 컬렉션 `<Panel>` 섹션 추가 (전체 10개, 획득/잠금 상태 구분)
- `src/pages/PatchResult.tsx` — 저장 직후 칭호 달성 감지 + 만렙 토스트 큐와 병합해 순차 표시

---

## [Unreleased] — 2026-05-29 메타 수정

### Fixed
- `index.html` — `<title>` 값 `life-rpg-temp` → `life-rpg` 수정

---

## [Unreleased] — Terminal.sys v2 디자인 마이그레이션

### Added
- `Panel` 컴포넌트 — ASCII 코너 브래킷 터미널 패널 래퍼
- `SkillBar` 컴포넌트 — 100세그먼트 포스퍼 게이지
- `BuffTag` 컴포넌트 — buff / debuff / rare 3종 상태 태그 (`classifyTag` 헬퍼 포함)
- CRT 스캔라인 + 포스퍼 비네팅 전역 오버레이 (`body::before`, `body::after`)
- JetBrains Mono + Orbitron 폰트 페어 적용
- CSS 토큰 신규: `--color-gold`, `--color-gold-glow`, `--color-purple-glow`, `--color-text-dim`, `--color-bg-elev`, `--color-border-strong`
- 헬퍼 클래스 신규: `.t-panel`, `.t-panel--bracket`, `.t-glow`, `.t-glow-soft`, `.t-glow-gold`, `.t-label`, `.t-h1`, `.t-btn-primary`, `.t-btn-ghost`

### Changed
- `StatBar` — 10블록 + `delta` prop + ▲/▼ 티커 박스로 교체
- `CharacterSheet` — `Panel` + `SkillBar` + `BuffTag` 적용, `rounded-*` 제거
- `PatchResult` — `Panel` + `BuffTag` + 전일 대비 delta 계산 적용
- `DailyLog` — `Panel` 적용, `rounded-*` 전면 제거
- `Landing` — `Panel` + 골드 타이틀 액센트 + `.t-btn-primary` 적용
- `BottomNav` — 활성 탭 글로우 + 상단 2px 퍼플 글로우 라인 추가
- `Toast` — `kind` prop 추가(`'system' | 'rare'`), 각 kind별 헤더/글로우 스타일 분기. `rounded-lg` 제거
- `PatchResult` — 골드 플로팅 라벨, Orbitron 타이틀, `◢` 섹션 마커, 글로우 푸터, `t-btn-ghost` 수정 버튼, 지출 골드 글로우 추가
- `CharacterSheet` — 퍼플 라벨, Orbitron 캐릭터명·레벨, `◢` 섹션 마커, `t-btn-primary` 버튼 적용
- `DailyLog` — `◢` 섹션 마커, 활성 칩 글로우 피드백, `t-h1` 타이틀, `t-btn-primary` 저장 버튼 적용

### Fixed
- `src/components/BuffTag.tsx` — `BUFF_LIST`에 `'주말달성'` 누락으로 주말달성이 debuff로 오분류되던 버그 수정
- `src/pages/PatchResult.tsx` — 공유 이미지 배경색 `#12121a`(팔레트 외 임의 HEX) → `#0e0e16`(`--color-bg-card`)으로 교체

---

## [Unreleased] — 캘린더 게임 터미널 스타일 재작성

### Changed
- `src/styles/calendar.css` — 캘린더 전체 스타일을 게임 터미널 격자 UI로 재작성
  - 요일 헤더(`.react-calendar__month-view__weekdays`)와 날짜 그리드(`.react-calendar__month-view__days`)에 `border-left + border-top` (컨테이너) / `border-right + border-bottom` (각 셀) 조합으로 터미널 테이블 격자 구현
  - 오늘 날짜(`.react-calendar__tile--now`): `box-shadow: inset 0 0 0 1px #5dcaa5` 초록 테두리
  - 선택된 날짜(`.react-calendar__tile--active`): `box-shadow: inset 0 0 0 1px #534ab7` + 퍼플 반투명 배경 (`rgba(83, 74, 183, 0.12)`)
  - 패치 기록 있는 날(`.has-patch`): 퍼플 tint 배경(`rgba(83, 74, 183, 0.06)`) + `::after` 하단 2px 퍼플 바
  - 네비게이션: `#0f0f13` 배경, 버튼 hover 시 `#1e1e2e` 하이라이트
  - 이웃 달 날짜(`.--neighboringMonth`): `#2a2a3a` dim 처리, `has-patch::after` 바 숨김

---

## [Unreleased] — 온보딩 게임 스타일 랜딩 화면 추가

### Added
- `react-type-animation` 패키지 설치 (gzip 4KB, React 19 호환)
- `src/pages/Onboarding.tsx` — step 0 랜딩 화면 추가. 게임 터미널 스타일로 3줄 타이핑 애니메이션 순차 출력 (`> SYSTEM v1.0.0 LOADED` / `> PLAYER DATA NOT FOUND` / `> CREATE NEW CHARACTER? [Y/N]`). "[Y] 캐릭터 만들기" 버튼 클릭 시 step 1 진입

### Changed
- `src/pages/Onboarding.tsx` — `Step` 타입 `1|2|3|4|5` → `0|1|2|3|4|5`로 확장. `useState<Step>` 초기값 `1` → `0`으로 변경. step 1의 "이전" 버튼이 step 0(랜딩)으로 복귀하도록 변경. 스텝 인디케이터(dot) 표시 조건 `step > 0`으로 변경

---

## [0.5.0] 2026-05-26 — 온보딩 지역 선택 및 날씨 정확도 개선

### Added
- `src/components/SidoPicker.tsx` (신규) — 17개 시도 버튼 그리드 재사용 컴포넌트. Onboarding Step 4와 Settings 지역 선택 섹션에서 공용 사용
- `src/types.ts` — `SidoName` 유니온 타입(17개 시도), `SidoCoord` 인터페이스 추가
- `src/lib/storage.ts` — `saveRegion()`, `loadRegion()` 추가 (`region` localStorage 키, `Character`와 분리)
- `src/lib/weather.ts` — `SIDO_LIST`, `SIDO_COORDS: Record<SidoName, SidoCoord>` 17개 시도 대표 좌표 추가
- `src/store/useStore.ts` — `region: SidoName | null` 상태 및 `setRegion()` 액션 추가

### Changed
- `src/store/useStore.ts` — `maxedSkills: string[]`를 Zustand 반응형 state로 통합. `getMaxedSkills()` 액션 제거, `markSkillsMaxed` 액션에 `set({ maxedSkills: merged })` 갱신 추가. 기존에는 매 호출마다 localStorage를 직접 읽는 구조였음
- `src/pages/PatchResult.tsx` — `getMaxedSkills()` 직접 호출 → `useStore(s => s.maxedSkills)` 셀렉터 구독으로 교체. `useMemo` 의존성 배열 정리
- `src/pages/Onboarding.tsx` — Step 타입 `1|2|3|4|5`로 확장. Step 4(지역 선택, 선택사항) 삽입, 기존 Step 4(기준값)를 Step 5로 이동. 미선택 시 null 저장 → geolocation fallback 유지
- `src/pages/Settings.tsx` — 지역 선택 섹션 추가 (`SidoPicker` 재사용)
- `src/hooks/useWeather.ts` — 저장된 `region`이 있으면 `SIDO_COORDS[region]` 좌표로 직접 fetch. airkorea API 호출 시 `sidoName` 쿼리 파라미터 전달. `useEffect` 의존성 배열에 `region` 추가
- `api/airkorea.ts` — `SIDO_ALLOWLIST` 추가, `sidoName` 쿼리 파라미터 직접 수신 지원 (allowlist 통과 시 우선, 아니면 기존 lat/lon 폴백)

### Fixed
- `src/lib/weather.ts` / `src/hooks/useWeather.ts` — `mapKmaWeather(pty)` 제거, `getWeatherLabel(pty, sky)` 도입. PTY=0(강수 없음) 시 SKY 코드 기반으로 맑음/구름많음/흐림 분기. 기존에는 PTY=0을 무조건 맑음으로 표시하던 문제 수정 (BUG-08)
- `src/hooks/useWeather.ts` — `getCurrentPosition` 세 번째 인자에 `{ timeout: TIMEOUT_MS }` 추가. timeout 미설정으로 geolocation 응답이 무한 대기되던 버그 수정 (BUG-07)
- `src/pages/DailyLog.tsx` — `useWeather()` error 상태 처리 추가. API 전체 실패 시 "날씨 정보를 불러오지 못했습니다" 오류 메시지 표시
- `src/components/SidoPicker.tsx` — hex 하드코딩 컬러 전체 → Tailwind 디자인 토큰으로 교체 (`bg-purple-primary`, `bg-bg-input`, `text-text-sub`, `hover:bg-border`)
- `src/pages/Onboarding.tsx` — hex 하드코딩 컬러 전체 → Tailwind 디자인 토큰으로 교체. `isStep4Valid = true` dead code 제거
- `eslint.config.js` — `api/**/*.ts`에 `globals.node` 별도 적용. 기존 `globals.browser`만 적용되어 `process` 변수 미인식 에러 수정
- `src/App.tsx` — `useState(() => isOnboardingDone())` 스냅샷 방식을 `useStore(s => s.onboardingDone)` 구독으로 교체. 온보딩 완료 직후 재리다이렉트 버그 수정 (BUG-06)
- `src/pages/Onboarding.tsx` — `handleComplete`의 `setOnboardingDone()` 직접 호출을 `completeOnboarding()` 스토어 액션으로 교체. `setOnboardingDone` import 제거

---

## [0.4.0] 2026-05-26 — 온보딩 + 개인 기준값

### Added
- `src/pages/Onboarding.tsx` (신규) — 앱 최초 진입 시 표시되는 4단계 온보딩 화면
  - Step 1~3 필수: 캐릭터명 / 클래스 (탭 6종 + 직접 입력) / 출생연도
  - Step 4 선택: 개인 기준값 설정 (sleepGoal 슬라이더, cafeMax 카운터, spendThreshold 칩). 건너뛰기 가능, 건너뛰면 DEFAULT_BASELINE 저장
  - 완료 시 `character` + `baseline` 저장, `onboarding_done` 플래그 저장 → `/` 이동
- `src/components/BaselineForm.tsx` (신규) — 개인 기준값 입력 폼 재사용 컴포넌트. Onboarding Step 4와 Settings에서 공용 사용
- `src/types.ts` — `PersonalBaseline` 인터페이스, `DEFAULT_BASELINE` 상수 추가 (`sleepGoal: 7`, `cafeMax: 2`, `spendThreshold: 30000`)
- `src/lib/storage.ts` — `saveBaseline`, `loadBaseline`, `isOnboardingDone`, `setOnboardingDone` 추가

### Changed
- `src/lib/stats.ts` — `calcHP`, `calcFocus`, `calcSleepQ`, `getStatusTags`, `calcStats`에 `baseline?: PersonalBaseline` 인자 추가. 미전달 시 DEFAULT_BASELINE fallback. 꿀잠 기준은 `sleepGoal + 1h` 자동 계산
- `src/store/useStore.ts` — `baseline` 상태 및 `setBaseline` 액션 추가
- `src/pages/Settings.tsx` — 개인 기준값 섹션 추가 (sleepGoal / cafeMax / spendThreshold). `CLASS_OPTIONS` export
- `src/App.tsx` — `onboarding_done` 키 없으면 `/onboarding` 리다이렉트하는 라우트 가드 추가. BottomNav 온보딩 화면에서 조건부 숨김

### Fixed
- `src/App.tsx` — 온보딩 완료 후 재리다이렉트 위험 (`isOnboardingDone()` 매 렌더 호출) → React state로 전환
- `src/lib/stats.ts` `calcWallet` — 음수 spend 입력이 패널티 없이 통과하던 문제. `spend > 0` 조건으로 수정
- `src/pages/Onboarding.tsx` — `birthYear === ''` 상태에서 `Number('')`=0이 저장되던 문제. guard 추가

---

### Fixed
- `api/airkorea.ts` — `getCtprvnRltmMesureDnsty`(시도별) endpoint에 측정소별 파라미터(`stationName`, `dataTerm`)를 사용해 실제 API 호출이 깨지던 버그 수정. `sidoName` 파라미터로 교체
- `api/airkorea.ts` — `getStationName()` → `getSidoName()` 리네임, 반환값을 측정소명 → 시도명(서울/부산/대구/광주/대전)으로 변경

---

### Added
- `src/lib/weather.ts` (신규) — `latlonToGrid` (Lambert 투영법 격자 좌표 변환), `getKmaBaseDateTime` (기상청 base_time 계산), `mapKmaWeather` (기상청 날씨 코드 → 레이블 매핑), `mapKhaiGrade` (에어코리아 통합대기환경지수 등급 매핑)
- `api/weather.ts` (신규) — 기상청 초단기실황 API(`getUltraSrtNcst`) Vercel Serverless Function 프록시. `KMA_API_KEY` 서버사이드 환경변수 사용
- `api/airkorea.ts` (신규) — 한국환경공단 에어코리아 API Vercel Serverless Function 프록시. `AIRKOREA_API_KEY` 서버사이드 환경변수 사용

### Changed
- `src/hooks/useWeather.ts` — OpenWeatherMap API 호출 제거, `/api/weather`, `/api/airkorea` 내부 프록시 호출로 전환
- `tsconfig.json` — `api/` 디렉터리 타입 검사 포함
- `vercel.json` — SPA rewrite 규칙에서 `/api/*` 경로 명시적 제외

### Removed
- `VITE_OPENWEATHER_API_KEY` 환경변수 제거 (클라이언트 노출 방지). `KMA_API_KEY`, `AIRKOREA_API_KEY`로 대체

---

### Added
- `src/pages/CalendarView.tsx` — 기록 없는 과거/오늘 날짜 클릭 시 "패치노트 작성하기" 버튼 표시. 미래 날짜는 안내 텍스트만 표시

### Changed
- `src/App.tsx` — `/daily/:date` 동적 라우트 추가 (기존 `/daily` 유지)
- `src/pages/DailyLog.tsx` — `useParams`로 날짜 수신, `isToday`/`isFuture` 분기 처리. 과거 날짜 저장 시 날씨/공기질 미저장, 미래 날짜는 저장 비활성화
- `src/pages/PatchResult.tsx` — "수정하기" 버튼 경로를 `/daily/${date}`로 수정

### Fixed
- `src/pages/PatchResult.tsx` — `getStatusTags` 재계산 블록 제거, 저장된 `patch.tags` 직접 사용 (BLOCK). 공휴일 미전달 등으로 저장 시와 렌더링 시 태그가 불일치하던 버그 해소
- `src/pages/CharacterSheet.tsx` — `getStatusTags` 재계산 블록 제거, `todayPatch?.tags ?? []` 직접 사용 (BLOCK). 공휴일에 작성한 패치노트 태그가 다르게 표시되던 버그 해소
- `src/lib/storage.ts` — `loadCharacter` JSON.parse에 try-catch 추가. 손상된 character 데이터로 인한 앱 진입 화이트스크린 방지 (WARN)

### Changed
- `src/store/useStore.ts` — `getMaxedSkills()`, `markSkillsMaxed(keys)` 액션 추가. skill_maxed localStorage 접근을 스토어로 집중 (WARN)
- `src/pages/PatchResult.tsx` — `loadMaxedSkills`/`saveMaxedSkills` 직접 import 제거, useStore 액션으로 교체 (WARN)
- `src/styles/calendar.css` — `#181826` 하드코딩 컬러 → `var(--color-bg-input)` 토큰으로 교체 (WARN)
- `src/types.ts` — `StatConfig` 인터페이스 export 추가. `PatchResult.tsx`/`CharacterSheet.tsx` 로컬 선언 제거 후 import 통일 (WARN)
- `src/lib/date.ts` — `formatDateLabel` 함수 export 추가. `PatchResult.tsx`/`DailyLog.tsx` 로컬 선언 제거 후 import 통일 (WARN)

### Added
- `src/lib/storage.test.ts` — 손상된 JSON / 빈 localStorage 방어 테스트 추가 (총 159개 통과)

---

### Added
- `src/hooks/useWeather.ts` — OpenWeatherMap Current Weather + Air Pollution API 훅. 위치 거부 시 서울 좌표 fallback, AbortController 타임아웃 처리
- `src/lib/holidays.ts` — 2025/2026년 공휴일 정적 Set + `isHoliday(dateStr): boolean`
- `vercel.json` — SPA rewrites 설정 (모든 경로 → index.html)
- `src/lib/holidays.test.ts` — vitest 단위 테스트 11개 신규
- `src/lib/stats.test.ts` — 공휴일 통합 테스트 7개 추가 (전체 157개 통과)
- `e2e/daily-log.spec.ts` — 날씨 API 키 없을 때 Pill 미표시 케이스 추가

### Fixed
- `src/store/useStore.ts` — `savePatchEntry`의 `tags: []` 하드코딩 제거 → `getStatusTags` 결과로 올바르게 계산 (주간/월간 리포트 summaryMessage 정상화)
- `src/pages/PatchResult.tsx` — `getStatusTags` 호출 시 `isHoliday` 누락 수정
- `src/hooks/useWeather.ts` — 위치 거부 시 `error: true` 제거, 서울 fallback만 적용
- `src/lib/holidays.ts` — 날짜 오류 수정 (2026-05-24 부처님오신날, 2026-05-25 대체공휴일), 2025년 공휴일 추가
- `src/pages/PatchResult.tsx` — 캡처 실패 시 Toast 피드백 추가
- `src/pages/DailyLog.tsx` — Pill 렌더링 IIFE → 조건부 렌더링으로 정리
- `index.html` — lang="en" → lang="ko"

### Changed
- `src/types.ts` — `PatchEntry`에 `weather?: string`, `aqi?: string` optional 필드 추가
- `src/lib/stats.ts` — `calcStats` 내 `isWeekend`에 `isHoliday` 통합 (공휴일 → HP +15, Social +10 보너스)
- `src/pages/DailyLog.tsx` — `useWeather` 훅 호출, `isHoliday` 호출, 날씨/AQI Pill 배지 렌더링, 저장 시 weather/aqi 포함. Counter 터치타겟 min-w-11 min-h-11 적용
- `src/pages/PatchResult.tsx` — 결과 카드 내 공유 아이콘 버튼 추가 (html-to-image 캡처 + Web Share API)
- `src/components/BottomNav.tsx` — safe-area-inset-bottom 인라인 스타일 추가
- `index.html` — viewport-fit=cover 추가

---

### Added
- `src/pages/Analysis.tsx` — 주간/월간 탭 전환, 빈 상태 처리, useMemo로 리포트·차트 데이터 계산
- `src/components/WeeklyReportCard.tsx` — 주간 리포트 카드 (출석 현황, MVP/위험 스탯, 스킬 성장, verdict 배지)
- `src/components/MonthlyReportCard.tsx` — 월간 리포트 카드 (평균 수면, 총 지출, 최고/최저일, 예측 메시지)
- `src/components/StatTrendChart.tsx` — Recharts LineChart (hp/focus/wallet 트렌드), `STAT_TREND_COLORS` export
- `src/components/SkillBarChart.tsx` — Recharts BarChart (4스킬 레벨)
- `src/components/AnalysisTabBar.tsx` — 주간/월간 탭 컴포넌트
- `src/lib/date.ts` — `today()`, `getWeekDateRange()` 신규 (CharacterSheet·DailyLog 중복 제거)
- `src/lib/stats.ts` — `getWeekBounds`, `getMonthBounds`, `calcWeeklyReport`, `calcMonthlyReport`, `calcStatTrend` 추가
- `src/lib/analysis.test.ts` — vitest 단위 테스트 58개 추가
- `e2e/analysis.spec.ts` — e2e 테스트 13개 추가
- `PatchResult` 페이지 — DailyLog 저장/수정 후 진입 시 특수스킬 만렙 달성 토스트 이펙트
  - 트리거: `DailyLog`에서 저장 후 navigate 시 `{ state: { fromSave: true } }` 전달, `PatchResult`에서 `useLocation`으로 확인. 캘린더 등 직접 조회 시 미발동
  - 만렙(Lv.MAX) 달성한 스킬별 순차 토스트 표시 (스킬명 + "만렙 달성!" + 특수 칭호 언락 메시지)
  - 스킬 데이터는 `useStore`의 `skills` 구독 방식으로 참조
- `src/components/Toast.tsx` — 공용 토스트 컴포넌트 신설
- vitest 단위 테스트 도입
  - `package.json`, `vite.config.ts` — vitest 설정 추가 (environment: jsdom)
  - `src/lib/stats.test.ts` — calcHP/Focus/Social/Wallet/Outdoor/SleepQ/getStatusTags/formatSpend/calcStats 67개 케이스
  - `src/lib/storage.test.ts` — loadPatch/loadAllPatches 손상 JSON 방어 포함 14개 케이스
- `e2e/patch-result.spec.ts` — fromSave 토스트 표시/미표시/큐 순차 케이스 3개 추가 (총 38개)

### Fixed
- `calcWeeklyReport` — mvpStat와 dangerStat이 같은 스탯일 경우 `finalDangerStat = null`로 처리 (BLOCK-1)
- `calcWeeklyReport` — skillsAfter 범위를 weekEntries만으로 제한 (BLOCK-2)
- `calcMonthlyReport` — dayStats 불필요한 sort 제거 (WARN-4)
- `StatTrendChart.tsx` — 인라인 hex 컬러를 `STAT_TREND_COLORS` import로 통일 (WARN-5)
- `PatchResult.tsx` — `useStore.getState()` → `useStore((s) => s.skills)` 구독 방식으로 변경 (WARN-2), skills를 useMemo deps에 추가 (WARN-3)
- `getWeekDateRange` 사용으로 날짜 범위 생성 일관성 확보 (WARN-1)
- `Toast.tsx` `onClose` 콜백 무한루프 버그 — `useRef` 패턴으로 안정화
- `calcWallet` spend=0 fallthrough 버그 — spend=0일 때 `else if (spend < 30000)` 분기로 진입해 wallet -20 패널티가 적용되던 문제. `spend <= 0`이면 spend 패널티 없음 (wallet 100 유지)
- `storage.ts` `loadPatch` / `loadAllPatches` — `JSON.parse` try-catch 추가. 손상된 localStorage 데이터로 인한 앱 전체 크래시 방지

### Changed
- `src/pages/Analysis.tsx` — Phase 3 예약 스텁에서 실제 분석 화면으로 교체
- `PatchResult.tsx` — `fromSave` 플래그 방식으로 만렙 체크 진입점 단일화, `useStore((s) => s.skills)` 구독 사용, `SKILL_META` 타입 보강, skills useMemo deps 추가
- `PatchResult.tsx` — `useState` 초기화 함수에서 `saveMaxedSkills` 제거, `useMemo`(순수 계산) + `useEffect`(localStorage 쓰기)로 분리
- `DailyLog.tsx` — 저장 후 navigate 시 `{ state: { fromSave: true } }` 추가
- `types.ts` — `SkillConfig` 인터페이스 추가, `key` 타입을 `keyof Skills`로 지정. `SkillModal.tsx`, `CharacterSheet.tsx` import 경로 통일
- `stats.ts` — `formatSpend` 조건식 `!amount || amount === 0` → `amount <= 0` 정리
- `CharacterSheet.tsx` — `getStatusTags` 호출 시 `new Date().getDay()` → `new Date(todayPatch.date + 'T00:00:00').getDay()` 변경

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
