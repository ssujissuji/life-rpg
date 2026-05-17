# HISTORY.md — 완료된 작업 기록

완료된 작업을 날짜 역순으로 기록합니다.

---

## 2026-05-17

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
