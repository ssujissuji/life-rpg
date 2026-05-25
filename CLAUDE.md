# CLAUDE.md — 현생 RPG 프로젝트 규칙

이 파일은 Claude가 이 프로젝트에서 작업할 때 반드시 따라야 할 규칙 모음입니다.

---

## 프로젝트 개요

- **앱명:** 현생 RPG
- **컨셉:** 하루를 패치노트로 기록하고, 인생을 RPG 캐릭터 시트로 보는 앱
- **PRD:** `/PRD.md` 참고
- **기술 스택:** React 19 + Vite, TypeScript 6 strict, Tailwind CSS v4, Zustand v5, React Router v7, react-calendar, Recharts

---

## 디렉토리 구조

```
src/
├── components/   # 재사용 가능한 UI 컴포넌트 (BottomNav, StatBar 등)
├── pages/        # 페이지 단위 컴포넌트 (CharacterSheet, DailyLog 등)
├── store/        # Zustand 스토어 (useStore.ts)
├── hooks/        # 커스텀 훅
├── lib/          # 유틸리티 (storage.ts, stats.ts 등)
└── types.ts      # 공용 타입 정의
```

---

## 디자인 시스템 규칙

> 상세 스펙은 `docs/DESIGN.md` 를 항상 먼저 확인할 것

- **테마:** 다크모드 전용 (라이트모드 절대 추가하지 않음)
- **폰트:** 모노스페이스 전용 (`font-mono`)
- **컬러:** DESIGN.md 팔레트만 사용, 임의 컬러 추가 금지
- **UI 스타일:** 게임 터미널 느낌, 각진 엣지, 픽셀감 있는 프로그레스바
- Tailwind 클래스는 인라인으로 작성 (별도 CSS 파일 최소화)

---

## 코드 작성 규칙

- 컴포넌트: `PascalCase`, 함수형 컴포넌트만 사용
- 훅: `use` 접두사 필수
- `any` 타입 사용 금지 — 불명확한 경우 `unknown` 또는 명시적 타입 정의
- `console.log` 커밋 금지
- 상태관리는 Zustand (`src/store/useStore.ts`) 만 사용
- localStorage 접근은 반드시 `src/lib/storage.ts` 헬퍼를 통해서만
- 능력치 계산 로직은 반드시 `src/lib/stats.ts` 에 위치
- 컴포넌트는 `.tsx`, 유틸/스토어는 `.ts` 확장자 사용
- 공용 타입은 `src/types.ts` 에 정의, 컴포넌트·페이지에서 import해서 사용
- 불필요한 주석, docstring 추가하지 않음
- 한 컴포넌트에 너무 많은 역할 부여하지 않음 (단일 책임)

---

## 파일 관리 규칙

- 작업 시작 전: `docs/WORK.md` 에 현재 작업 내용 업데이트
- 작업 완료 후: `docs/HISTORY.md` 에 완료 내역 기록
- 기능 단위 완성 시: `docs/CHANGELOG.md` 에 변경사항 추가
- 새 파일 생성 시: 기존 파일 수정으로 해결 가능한지 먼저 검토

---

## 작업 진행 규칙

- 기능 추가 전 `PRD.md` 를 먼저 참고해서 스펙과 일치하는지 확인
- Phase 순서를 따름: Phase 1 MVP → Phase 2 캐릭터 → Phase 3 분석 → Phase 4 완성도
- 작업 전 유저에게 계획을 먼저 설명하고 확인 후 진행
- 한 번에 너무 많은 파일을 만들지 않음 — 기능 단위로 묶어서 진행
- 리팩토링, 코드정리, 주석 추가 등 요청하지 않은 작업은 하지 않음
- 파괴적인 작업(파일 삭제, 데이터 초기화 등)은 반드시 확인 후 진행

---

## 현재 Phase

**Phase 1 — MVP 완료**

세부 진행 상황은 `docs/WORK.md` 참고
