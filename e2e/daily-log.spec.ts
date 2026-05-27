import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear()
    localStorage.setItem('onboarding_done', '1')
    sessionStorage.setItem('has_landed', '1')
  })
  await page.goto('/daily')
})

test.describe('DailyLog — 기본 렌더링', () => {
  test('"오늘의 패치노트" 헤더가 표시된다', async ({ page }) => {
    await expect(page.getByText('오늘의 패치노트')).toBeVisible()
  })

  test('오늘 날짜가 v YYYY.MM.DD 형식으로 표시된다', async ({ page }) => {
    const d = new Date()
    const version = `v${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    await expect(page.getByText(new RegExp(version))).toBeVisible()
  })

  test('수면 시간 슬라이더 기본값이 7시간이다', async ({ page }) => {
    await expect(page.getByText('😴 수면 시간 — 7시간')).toBeVisible()
  })

  test('식사 횟수 기본값으로 "2끼"가 선택되어 있다', async ({ page }) => {
    const btn = page.getByRole('button', { name: '2끼' })
    await expect(btn).toHaveClass(/bg-purple-primary/)
  })

  test('"패치노트 저장" 제출 버튼이 표시된다', async ({ page }) => {
    // 저장 버튼 텍스트가 "패치노트 저장 →"에서 "패치노트 저장" + Save 아이콘으로 변경됨
    await expect(page.getByRole('button', { name: /패치노트 저장/ })).toBeVisible()
  })
})

test.describe('DailyLog — 인터랙션', () => {
  test('지출 칩 클릭 시 합계가 증가한다', async ({ page }) => {
    await page.getByRole('button', { name: '+1만' }).click()
    await expect(page.getByText('합계: 1만원')).toBeVisible()

    await page.getByRole('button', { name: '+5천' }).click()
    await expect(page.getByText('합계: 1만 5천원')).toBeVisible()
  })

  test('초기화 버튼이 지출 > 0일 때만 나타난다', async ({ page }) => {
    await expect(page.getByRole('button', { name: '초기화' })).not.toBeVisible()

    await page.getByRole('button', { name: '+1만' }).click()
    await expect(page.getByRole('button', { name: '초기화' })).toBeVisible()

    await page.getByRole('button', { name: '초기화' }).click()
    await expect(page.getByText('합계: 0원')).toBeVisible()
    await expect(page.getByRole('button', { name: '초기화' })).not.toBeVisible()
  })

  test('감정 이모지 선택 시 ring 스타일이 적용된다', async ({ page }) => {
    const btn = page.getByRole('button', { name: '😴' })
    await btn.click()
    await expect(btn).toHaveClass(/ring-2/)
  })

  test('폼 제출 시 /result/:date 로 이동한다', async ({ page }) => {
    await page.getByRole('button', { name: /패치노트 저장/ }).click()

    const d = new Date()
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    await expect(page).toHaveURL(`/result/${today}`)
  })
})

test.describe('DailyLog — 날씨 Pill (API 키 없음)', () => {
  test('VITE_OPENWEATHER_API_KEY 없으면 날씨 Pill이 렌더되지 않는다', async ({ page }) => {
    // 테스트 환경은 API 키가 설정되지 않으므로 weatherLabel=null, aqiLabel=null
    // isLoading=false 상태에서 날씨·공기질 Pill이 보이지 않아야 한다
    await expect(page.getByText('날씨 확인 중...')).not.toBeVisible()
    // weatherLabel이 null이면 날씨 span이 없다
    // 공휴일이 아닌 날에는 Pill 컨테이너 자체가 렌더되지 않는다
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    // 오늘이 공휴일인 경우 "🎌 공휴일" Pill은 표시될 수 있으나 날씨/공기질 Pill은 없다
    // 날씨 형식은 "☀️ 맑음" / "🌧️ 비" 등이며, 공기질은 "💚 좋음" 등의 패턴이다
    // 두 Pill 모두 text-purple-light 클래스를 가지므로 날씨·공기질 span만 선택
    const weatherPill = page.locator('span.text-purple-light')
    // API 키가 없으면 날씨 Pill이 전혀 없어야 한다
    await expect(weatherPill).toHaveCount(0)
    // "날씨 확인 중..." 텍스트도 없어야 한다
    await expect(page.getByText('날씨 확인 중...')).not.toBeVisible()
    // 오늘이 공휴일 여부와 무관하게 isLoading이 false이고 날씨 label이 null인 상태
    void dateStr
  })
})

test.describe('DailyLog — 기존 기록 초기값 로드', () => {
  test('오늘 기록이 있으면 폼에 저장된 값이 초기값으로 로드된다', async ({ page }) => {
    const d = new Date()
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    await page.addInitScript((dateStr) => {
      const entry = {
        date: dateStr,
        sleep: 9,
        meal: 3,
        cafe: 2,
        delivery: 1,
        spend: 35000,
        emoji: '🔥',
        memo: '테스트 메모',
        stats: { hp: 70, focus: 60, social: 50, wallet: 80, outdoor: 60, sleepQ: 70 },
        tags: [],
      }
      localStorage.setItem(`patch_${dateStr}`, JSON.stringify(entry))
    }, today)

    await page.goto('/daily')

    // 수면 9시간으로 로드
    await expect(page.getByText('😴 수면 시간 — 9시간')).toBeVisible()

    // 식사 "3끼" 선택됨
    await expect(page.getByRole('button', { name: '3끼', exact: true })).toHaveClass(/bg-purple-primary/)

    // 지출 합계 35,000원 로드
    await expect(page.getByText('합계: 3만 5천원')).toBeVisible()

    // 메모 로드
    await expect(page.getByPlaceholder('오늘의 특이사항...')).toHaveValue('테스트 메모')
  })
})
