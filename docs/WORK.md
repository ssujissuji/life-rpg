# WORK.md — 현재 작업 현황

## 현재 Phase: Phase 1 — MVP

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

## 다음 작업 (Phase 1 마무리)

- [ ] 실제 브라우저 UI 확인 및 레이아웃 이슈 수정
- [ ] react-calendar 스타일 다크 테마 완성도 점검
- [ ] 오늘 날짜 이미 기록 있을 때 DailyLog 초기값 정상 로드 확인

---

## 대기 중인 작업 (다음 Phase)

### Phase 2
- 캐릭터 시트 고도화 (만렙 달성 이펙트)
- 특수스킬 상세 모달

### Phase 3
- 주간/월간 리포트 화면
- Recharts 스탯 그래프

### Phase 4
- 날씨 API (OpenWeatherMap), 미세먼지 API (에어코리아), 공휴일 API (공공데이터포털)
- 카드 이미지 저장/공유 기능
- 반응형 모바일 UI 점검
- Vercel 배포
