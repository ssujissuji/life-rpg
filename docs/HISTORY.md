# HISTORY.md — 완료된 작업 기록

완료된 작업을 날짜 역순으로 기록합니다.

---

## 2026-05-27

### 캘린더 게임 터미널 스타일 재작성

**src/styles/calendar.css**
- 캘린더 전체 스타일을 게임 터미널 격자 UI로 재작성
- 요일 헤더 컨테이너(`.react-calendar__month-view__weekdays`)에 `border-left: 1px solid #2a2a3a`, `border-top: 1px solid #2a2a3a` 추가
- 각 요일 셀(`.react-calendar__month-view__weekdays__weekday`)에 `border-right`, `border-bottom` 추가 — 컨테이너와 셀 조합으로 외곽 포함한 격자 완성
- 날짜 그리드 컨테이너(`.react-calendar__month-view__days`)에 `border-left: 1px solid #2a2a3a` 추가
- 각 날짜 타일(`.react-calendar__tile`)에 `border-right`, `border-bottom` 추가
- 오늘 날짜(`.react-calendar__tile--now`): `box-shadow: inset 0 0 0 1px #5dcaa5` (초록 테두리)
- 선택된 날짜(`.react-calendar__tile--active`): `box-shadow: inset 0 0 0 1px #534ab7` + `rgba(83, 74, 183, 0.12)` 배경
- 패치 기록 있는 날(`.has-patch`): `rgba(83, 74, 183, 0.06)` 배경 + `::after` 하단 2px `#534ab7` 바
- 이웃 달 날짜(`.--neighboringMonth`): `color: #2a2a3a !important` dim 처리. `.--neighboringMonth.has-patch::after`: `display: none`으로 바 숨김
- 네비게이션 배경: `#0f0f13`, 버튼 hover: `background: #1e1e2e`, `color: #afa9ec`

---

## 2026-05-26

### 온보딩 게임 스타일 랜딩 화면 추가

**패키지**
- `react-type-animation` 설치 (gzip 4KB, React 19 호환). 타이핑 애니메이션 구현에 사용

**src/pages/Onboarding.tsx**
- `Step` 타입 `1|2|3|4|5` → `0|1|2|3|4|5`로 확장
- `useState<Step>` 초기값 `1` → `0`으로 변경
- step === 0일 때 게임 터미널 스타일 랜딩 화면 렌더링
- `TypeAnimation` 컴포넌트로 다음 3줄 순차 타이핑 출력:
  - `> SYSTEM v1.0.0 LOADED`
  - `> PLAYER DATA NOT FOUND`
  - `> CREATE NEW CHARACTER? [Y/N]`
- "[Y] 캐릭터 만들기" 버튼 클릭 시 step 1(이름 입력)로 진입
- step 1의 "이전" 버튼 클릭 시 step 0(랜딩)으로 복귀
- 스텝 인디케이터(dot) 표시 조건을 `step > 0`일 때만으로 변경

---

### maxedSkills Zustand 반응형 상태 통합

**배경:** `getMaxedSkills()` 액션이 매 호출마다 localStorage를 직접 읽는 구조였음. `maxedSkills`가 Zustand 반응형 state가 아니라 컴포넌트가 상태 변경에 구독하지 못하는 문제 존재.

**src/store/useStore.ts**
- `StoreState` 인터페이스에 `maxedSkills: string[]` 필드 추가
- 초기값에 `maxedSkills: loadMaxedSkills()` 추가
- `getMaxedSkills: () => string[]` 액션 제거
- `markSkillsMaxed` 액션에 `set({ maxedSkills: merged })` 반응형 갱신 추가. 기존에는 `saveMaxedSkills(merged)` localStorage 쓰기만 수행

**src/pages/PatchResult.tsx**
- `getMaxedSkills()` 함수 호출 → `useStore(s => s.maxedSkills)` 셀렉터 구독으로 교체
- `useMemo` 의존성 배열에서 `getMaxedSkills` 제거, `maxedSkills` 추가

---

### 날씨 렌더링 버그·경고 수정

**src/lib/weather.ts**
- `mapKmaWeather(pty)` 제거
- `getWeatherLabel(pty, sky)` 추가. PTY≠0이면 강수 라벨(비/눈 등) 반환, PTY=0이면 SKY(하늘상태) 기반으로 맑음/구름많음/흐림 반환

**src/hooks/useWeather.ts**
- import를 `mapKmaWeather` → `getWeatherLabel`로 교체
- 날씨 API 응답에서 PTY와 SKY 카테고리를 모두 추출해 `getWeatherLabel(pty, sky)` 호출로 변경
- `navigator.geolocation.getCurrentPosition` 세 번째 인자에 `{ timeout: TIMEOUT_MS }` 추가 (BUG-07)

**src/pages/DailyLog.tsx**
- `useWeather()`에서 `error` 상태 destructure 추가
- API 전체 실패 시 "날씨 정보를 불러오지 못했습니다" 오류 메시지 UI 추가

**src/components/SidoPicker.tsx**
- hex 하드코딩 컬러(`#534ab7`, `#1e1e2e`, `#6b7280`, `#2a2a3a`) → Tailwind 디자인 토큰(`bg-purple-primary`, `bg-bg-input`, `text-text-sub`, `hover:bg-border`)으로 교체

**src/pages/Onboarding.tsx**
- hex 하드코딩 컬러 전체 → Tailwind 디자인 토큰으로 교체 (`bg-bg-root`, `bg-bg-card`, `bg-bg-input`, `bg-purple-primary`, `border-border`, `text-text-sub`, `text-danger`, `text-purple-light`, `placeholder-text-sub` 등)
- `isStep4Valid = true` dead code 제거 및 disable 조건에서 해당 조건 제거

**BUG-07 — geolocation 무한 로딩**
- 원인: `navigator.geolocation.getCurrentPosition` 호출 시 세 번째 인자(options) 미설정으로 timeout이 Infinity로 동작
- 해결: `{ timeout: TIMEOUT_MS }` 옵션 추가

**BUG-08 — PTY=0을 맑음으로 오표시**
- 원인: `mapKmaWeather(pty)`가 PTY 코드만 보고 PTY=0(강수 없음)을 맑음으로 반환. SKY(하늘상태) 코드를 활용하지 않아 구름많음/흐림이 맑음으로 표시됨
- 해결: `getWeatherLabel(pty, sky)` 함수로 교체. PTY=0인 경우 SKY 코드 기반으로 맑음/구름많음/흐림 분기 처리

---

### BUG-06 — 온보딩 완료 후 리다이렉트 버그 수정

**현상:** 온보딩 완료 후 `/`로 이동하지 않고 온보딩 첫 화면으로 다시 튕기는 문제

**원인:**
- `App.tsx`의 `useState(() => isOnboardingDone())`가 마운트 시 1회만 localStorage를 읽어 이후 상태 변경을 반영하지 못함
- `Onboarding.tsx`의 `handleComplete`가 `setOnboardingDone()`으로 localStorage에는 기록하지만 store의 `onboardingDone`은 `false`로 남음
- `navigate('/')` 후 `AppShell` 가드가 `onboarded = false`로 판단해 다시 `/onboarding`으로 리다이렉트

**수정 파일 및 방식:**

`src/App.tsx`
- `useState(() => isOnboardingDone())` 제거 → `useStore(s => s.onboardingDone)` 반응형 구독으로 교체
- `isOnboardingDone`, `useState` import 제거

`src/pages/Onboarding.tsx`
- `handleComplete`의 `setOnboardingDone()` 직접 호출 제거 → `completeOnboarding()` 스토어 액션 호출로 교체
- `setOnboardingDone` import 제거

---

### 온보딩 지역 선택 기능 추가

**신규 파일**
- `src/components/SidoPicker.tsx` — 17개 시도 버튼 그리드 재사용 컴포넌트. Onboarding Step 4와 Settings 지역 선택 섹션에서 공용 사용

**src/types.ts**
- `SidoName` 유니온 타입 추가 (17개 시도명 리터럴)
- `SidoCoord` 인터페이스 추가 (`lat`, `lon` 필드)

**src/lib/storage.ts**
- `saveRegion(sido)`, `loadRegion()` 추가. 별도 `region` localStorage 키 사용 (`Character` 인터페이스와 분리)

**src/lib/weather.ts**
- `SIDO_LIST` 배열 추가 (17개 시도명)
- `SIDO_COORDS: Record<SidoName, SidoCoord>` 추가. 17개 시도별 대표 위경도 좌표

**src/store/useStore.ts**
- `region: SidoName | null` 상태 추가 (초기값 `loadRegion()`)
- `setRegion(sido)` 액션 추가

**src/pages/Onboarding.tsx**
- Step 타입 `1|2|3|4` → `1|2|3|4|5`로 확장
- Step 4(지역 선택, 선택사항) 삽입. 미선택 시 null 저장 → 기존 geolocation fallback 유지
- 기존 Step 4(기준값)를 Step 5로 이동
- `handleComplete`에서 `setRegion()` 호출

**src/pages/Settings.tsx**
- 지역 선택 섹션 추가. `SidoPicker` 재사용
- `handleSave`에서 `setRegion()` 호출

**src/hooks/useWeather.ts**
- 저장된 `region`이 있으면 `SIDO_COORDS[region]` 좌표로 직접 fetch (geolocation 생략)
- airkorea API 호출 시 `?sidoName=` 쿼리 파라미터 전달
- `useEffect` 의존성 배열에 `region` 추가

**api/airkorea.ts**
- `SIDO_ALLOWLIST` 추가 (허용된 시도명 집합)
- `sidoName` 쿼리 파라미터 직접 수신 지원. allowlist 통과 시 우선 사용, 아니면 기존 lat/lon 기반 폴백 유지

**eslint.config.js**
- `api/**/*.ts`에 `globals.node` 별도 적용. 기존 `globals.browser`만 적용되어 `process` 변수 미인식 ESLint 에러 수정

---

### Phase 1.5 — 온보딩 + 개인 기준값

**신규 파일**
- `src/pages/Onboarding.tsx` — 4단계 온보딩 화면. Step 1(이름), Step 2(클래스), Step 3(출생연도)는 필수. Step 4(기준값 설정)는 건너뛰기 가능, 건너뛰면 DEFAULT_BASELINE 저장. 완료 시 `character` + `baseline` localStorage 저장, `onboarding_done` 플래그 저장 → `/` 이동
- `src/components/BaselineForm.tsx` — 개인 기준값 입력 폼 재사용 컴포넌트. sleepGoal 슬라이더(4~10h, step 0.5), cafeMax 카운터(1~5), spendThreshold 칩 선택(1만/2만/3만/5만/10만). Onboarding Step 4와 Settings 기준값 섹션에서 공용 사용

**src/types.ts**
- `PersonalBaseline` 인터페이스 추가 (`sleepGoal`, `cafeMax`, `spendThreshold` 필드)
- `DEFAULT_BASELINE` 상수 추가 (`sleepGoal: 7`, `cafeMax: 2`, `spendThreshold: 30000`)

**src/lib/storage.ts**
- `saveBaseline(baseline)`, `loadBaseline()` 추가 (`baseline` localStorage 키)
- `isOnboardingDone()`, `setOnboardingDone()` 추가 (`onboarding_done` localStorage 키)

**src/lib/stats.ts**
- `calcHP`, `calcFocus`, `calcSleepQ`, `getStatusTags`, `calcStats`에 `baseline?: PersonalBaseline` 인자 추가. 미전달 시 DEFAULT_BASELINE fallback
- `calcWallet` — PRD 스펙 맞게 spend 조건 수정 (`spend > 0`). 꿀잠 기준은 `sleepGoal + 1h`로 자동 계산 (UI 미노출)

**src/store/useStore.ts**
- `baseline: PersonalBaseline` 상태 추가 (초기값 `loadBaseline()`)
- `setBaseline(baseline)` 액션 추가

**src/pages/Settings.tsx**
- 개인 기준값 섹션 추가 (sleepGoal / cafeMax / spendThreshold). `BaselineForm` 재사용
- `CLASS_OPTIONS` 배열 export 추가 (Onboarding과 공유)

**src/App.tsx**
- 온보딩 라우트 가드 추가. `onboarding_done` 키 없으면 `/onboarding`으로 리다이렉트
- BottomNav 온보딩 화면에서 조건부 숨김 처리
- 온보딩 완료 후 재리다이렉트 방지 위해 `isOnboardingDone()` 매 렌더 호출 → React state로 전환 (BLOCK)

**코드 리뷰 수정사항 반영**
- `src/lib/stats.ts` `calcWallet` — 음수 입력이 패널티 없이 통과하던 문제. `spend > 0` 조건으로 수정 (BLOCK)
- `src/pages/Onboarding.tsx` `handleComplete` — `birthYear === ''`일 때 `Number('')`=0이 저장되던 문제. guard 추가 (BLOCK)
- `src/components/BaselineForm.tsx` — 로컬 `formatSpend` 중복 제거, `stats.ts` import로 대체 (WARN)
- `src/pages/Onboarding.tsx` — `hover:bg-[#4340a0]` 하드코딩 → `hover:bg-purple-dark` 토큰으로 교체 (WARN)
- `src/store/useStore.ts` — `loadAllPatches()` 이중 호출 → 변수에 담아 재사용 (WARN)

---

### AirKorea API 파라미터 버그 수정

**api/airkorea.ts**
- `getStationName()` → `getSidoName()` 으로 리네임
  - 반환값을 측정소명(종로구, 연제구 등) → 시도명(서울, 부산, 대구, 광주, 대전)으로 변경
- URL 파라미터 `stationName` + `dataTerm=DAILY` 제거 → `sidoName`으로 교체
  - 원인: endpoint를 `getMsrstnAcctoRltmMesureDnsty`(측정소별) → `getCtprvnRltmMesureDnsty`(시도별)로 변경했으나 URL 파라미터가 측정소별 기준으로 남아 있어 실제 API 호출이 깨진 상태였음
  - 해결: 시도별 endpoint에 맞게 `sidoName` 파라미터 사용
- curl로 KMA 기상청 API(NORMAL_SERVICE, PTY=0, 기온 26.1°C), AirKorea API(NORMAL_CODE, khaiGrade=2 보통) 정상 응답 확인

---

## 2026-05-25

### 날씨/공기질 API 한국 공공 API로 전환

**신규 파일**
- `src/lib/weather.ts` — Lambert 투영법 기반 `latlonToGrid` (위경도 → 격자 좌표 변환), `getKmaBaseDateTime` (현재 시각 기준 기상청 base_time 계산), `mapKmaWeather` (기상청 PTY/SKY 코드 → 날씨 레이블), `mapKhaiGrade` (에어코리아 통합대기환경지수 등급 → 레이블) 분리
- `api/weather.ts` — 기상청 초단기실황 API(`getUltraSrtNcst`) Vercel Serverless Function 프록시. `KMA_API_KEY` 서버사이드 환경변수 사용. CORS 우회
- `api/airkorea.ts` — 한국환경공단 에어코리아 API Vercel Serverless Function 프록시. `AIRKOREA_API_KEY` 서버사이드 환경변수 사용. CORS 우회

**src/hooks/useWeather.ts**
- OpenWeatherMap Current Weather + Air Pollution API 호출 전면 제거
- `/api/weather`, `/api/airkorea` 내부 프록시 엔드포인트 호출로 전환

**tsconfig.json**
- `include`에 `api/` 디렉터리 추가. Serverless Function 파일에 타입 검사 적용

**vercel.json**
- SPA rewrite 규칙(`/*` → `/index.html`)에서 `/api/*` 경로를 명시적으로 제외. Serverless Function이 rewrite에 의해 가려지는 문제 방지

**환경변수**
- `VITE_OPENWEATHER_API_KEY` 제거 (클라이언트 번들에 API 키 노출 제거)
- `KMA_API_KEY`, `AIRKOREA_API_KEY` 서버사이드 환경변수로 대체

---

### 캘린더에서 과거 날짜 패치노트 작성 기능

**src/App.tsx**
- `/daily/:date` 동적 라우트 추가. 기존 `/daily` (오늘 날짜용) 유지

**src/pages/DailyLog.tsx**
- `useParams`로 `:date` 수신
- `isToday`, `isFuture` 분기 추가. 과거 날짜 저장 시 날씨/공기질 필드 미포함, 미래 날짜는 저장 버튼 비활성화

**src/pages/CalendarView.tsx**
- 기록 없는 과거/오늘 날짜 클릭 시 "패치노트 작성하기" 버튼 표시 → `/daily/${dateStr}` 이동
- 미래 날짜 클릭 시 저장 불가 안내 텍스트만 표시
- `today()` import로 날짜 비교 통일 (로컬 날짜 파싱 일관성 확보)

**src/pages/PatchResult.tsx**
- "수정하기" 버튼 이동 경로를 `/daily` → `/daily/${date}`로 수정 (날짜 파라미터 전달)

---

### 코드 리뷰 수정사항 반영 (BLOCK/WARN 7개)

**src/pages/PatchResult.tsx**
- `getStatusTags` 재계산 블록 제거, `patch.tags` 직접 사용으로 변경 (BLOCK). `isHoliday`/`getStatusTags` import 제거
- `loadMaxedSkills`/`saveMaxedSkills` 직접 import 제거 (WARN), useStore 액션(`getMaxedSkills`, `markSkillsMaxed`)으로 교체
- `StatConfig` 로컬 선언 제거, `src/types.ts` import로 통일 (WARN)
- 로컬 `formatDateLabel` 제거, `src/lib/date.ts` import로 통일 (WARN)

**src/pages/CharacterSheet.tsx**
- `getStatusTags` 재계산 블록 제거, `todayPatch?.tags ?? []` 직접 사용으로 변경 (BLOCK). `getStatusTags` import 제거
- `StatConfig` 로컬 선언 제거, `src/types.ts` import로 통일 (WARN)

**src/pages/DailyLog.tsx**
- 로컬 `formatDateLabel` 제거, `src/lib/date.ts` import로 통일 (WARN)

**src/lib/storage.ts**
- `loadCharacter` JSON.parse에 try-catch 추가, 파싱 실패 시 기본값 반환 (WARN)

**src/lib/storage.test.ts**
- 손상된 JSON / 빈 localStorage 방어 테스트 추가 (총 159개 통과)

**src/store/useStore.ts**
- `getMaxedSkills()`, `markSkillsMaxed(keys)` 액션 추가. skill_maxed 관련 localStorage 접근을 스토어로 집중

**src/styles/calendar.css**
- `#181826` 하드코딩 컬러 → `var(--color-bg-input)` 토큰으로 교체 (WARN)

**src/types.ts**
- `StatConfig` 인터페이스 export 추가

**src/lib/date.ts**
- `formatDateLabel` 함수 export 추가

---

### Phase 4 — 날씨/공휴일/공유/모바일 완성도

**신규 파일**
- `src/hooks/useWeather.ts` — OpenWeatherMap Current Weather + Air Pollution API 훅. Geolocation API로 현재 위치 취득, 거부 시 서울 좌표(37.5665, 126.9780)로 fallback. AbortController로 8초 타임아웃 처리. weatherLabel/aqiLabel 반환
- `src/lib/holidays.ts` — 2025/2026년 공휴일 정적 Set + `isHoliday(dateStr: string): boolean`
- `vercel.json` — SPA rewrites 설정 (`/*` → `/index.html`)

**src/types.ts**
- `PatchEntry`에 `weather?: string`, `aqi?: string` optional 필드 추가

**src/lib/stats.ts**
- `calcStats` 내 `isWeekend` 판단에 `isHoliday` 통합. 공휴일을 주말과 동일하게 처리 (HP +15, Social +10 보너스)

**src/store/useStore.ts**
- `savePatchEntry`의 `tags: []` 하드코딩 제거 → `getStatusTags` 결과로 올바르게 계산. 이 버그로 주간/월간 리포트 summaryMessage가 태그 없는 상태로 계산되던 문제 해소 (BLOCK-1)

**src/pages/DailyLog.tsx**
- `useWeather` 훅 호출, `isHoliday` 호출, 날씨/AQI Pill 배지 조건부 렌더링 추가 (IIFE → 조건부 렌더링으로 정리)
- 저장 시 weather/aqi 포함
- Counter 컴포넌트 터치타겟 min-w-11 min-h-11 적용

**src/pages/PatchResult.tsx**
- 결과 카드 내 공유 아이콘 버튼 추가. html-to-image로 카드 캡처 후 Web Share API로 공유. 캡처 실패 시 Toast 피드백
- `getStatusTags` 호출 시 `isHoliday` 누락 수정 (BLOCK-2)

**src/components/BottomNav.tsx**
- safe-area-inset-bottom 인라인 스타일 추가 (아이폰 홈 인디케이터 영역 침범 방지)

**index.html**
- `viewport-fit=cover` 추가 (safe-area 사용 전제)
- `lang="en"` → `lang="ko"` 변경

**리뷰 수정사항 반영**
- BLOCK-1: `useStore.ts` — `tags: []` → `getStatusTags` 계산으로 수정
- BLOCK-2: `PatchResult.tsx` — `getStatusTags` 호출 시 `isHoliday` 누락 수정
- BLOCK-3: `useWeather.ts` — 위치 거부 시 `error: true` 제거, 서울 fallback만 적용
- WARN-4: `holidays.ts` — 날짜 오류 수정 (2026-05-24 부처님오신날, 2026-05-25 대체공휴일), 2025년 공휴일 추가
- WARN-5: `PatchResult.tsx` — 캡처 실패 시 Toast 피드백 추가
- WARN-6: `DailyLog.tsx` — Pill 렌더링 IIFE → 조건부 렌더링으로 정리
- SUGGEST-7: `index.html` — lang="ko" 변경
- SUGGEST-8: `PatchResult.tsx` — handleShare deps에서 cardRef 제거

**테스트**
- `src/lib/holidays.test.ts` 신규 — vitest 단위 테스트 11개 (isHoliday 경계 케이스 포함)
- `src/lib/stats.test.ts` — 공휴일 통합 테스트 7개 추가 (전체 157개 통과)
- `e2e/daily-log.spec.ts` — 날씨 API 키 없을 때 Pill 미표시 케이스 추가

---

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
