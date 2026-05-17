import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())
  await page.goto('/calendar')
})

test.describe('CalendarView — 기본 렌더링', () => {
  test('캘린더 제목과 기록 카운트가 표시된다', async ({ page }) => {
    await expect(page.locator('div.font-bold', { hasText: '캘린더' })).toBeVisible()
    await expect(page.getByText('기록된 날짜: 0일')).toBeVisible()
  })

  test('react-calendar가 마운트되어 날짜 그리드가 보인다', async ({ page }) => {
    const calendar = page.locator('.react-calendar')
    await expect(calendar).toBeVisible()

    // 요일 헤더 확인 (월~일 중 최소 1개)
    const weekdays = page.locator('.react-calendar__month-view__weekdays__weekday')
    await expect(weekdays.first()).toBeVisible()

    // 날짜 타일 확인
    const tiles = page.locator('.react-calendar__tile')
    await expect(tiles.first()).toBeVisible()
  })

  test('안내 문구가 하단에 표시된다', async ({ page }) => {
    await expect(
      page.getByText('기록된 날짜를 클릭하면 패치노트를 확인할 수 있습니다.'),
    ).toBeVisible()
  })
})

test.describe('CalendarView — hover 스타일', () => {
  test('타일 hover 시 배경이 미세하게 밝아진다 (#181826)', async ({ page }) => {
    const tile = page
      .locator('.react-calendar__tile:not(.react-calendar__tile--now)')
      .first()

    await tile.hover()

    const bg = await tile.evaluate((el) => getComputedStyle(el).backgroundColor)
    // rgb(24, 24, 38) = #181826
    expect(bg).toBe('rgb(24, 24, 38)')
  })

  test('타일 hover 시 날짜 텍스트에 퍼플 라이트 색상이 적용된다', async ({ page }) => {
    const tile = page
      .locator('.react-calendar__tile:not(.react-calendar__tile--now)')
      .first()

    await tile.hover()

    const color = await tile.evaluate((el) => getComputedStyle(el).color)
    // rgb(175, 169, 236) = #afa9ec
    expect(color).toBe('rgb(175, 169, 236)')
  })

  test('타일 hover 시 inset box-shadow가 적용된다', async ({ page }) => {
    const tile = page
      .locator('.react-calendar__tile:not(.react-calendar__tile--now)')
      .first()

    await tile.hover()

    const shadow = await tile.evaluate((el) => getComputedStyle(el).boxShadow)
    expect(shadow).not.toBe('none')
    expect(shadow).toContain('inset')
  })
})

test.describe('CalendarView — 날짜 클릭 인터랙션', () => {
  test('기록 없는 날 클릭 시 "기록 없음" 패널이 나타난다', async ({ page }) => {
    // 이웃 달 날짜가 아닌 현재 달의 날짜 중 오늘이 아닌 것 클릭
    const nonTodayTile = page
      .locator(
        '.react-calendar__month-view__days__day:not(.react-calendar__tile--now):not(.react-calendar__month-view__days__day--neighboringMonth)',
      )
      .first()

    await nonTodayTile.click()

    await expect(page.getByText(/기록 없음/)).toBeVisible()
  })

  test('오늘 날짜 클릭 시 "오늘 패치노트 작성하기" 버튼이 나타난다', async ({ page }) => {
    const todayTile = page.locator('.react-calendar__tile--now')
    await todayTile.click()

    await expect(page.getByText('오늘 패치노트 작성하기')).toBeVisible()
  })

  test('"오늘 패치노트 작성하기" 클릭 시 /daily로 이동한다', async ({ page }) => {
    const todayTile = page.locator('.react-calendar__tile--now')
    await todayTile.click()

    await page.getByText('오늘 패치노트 작성하기').click()

    await expect(page).toHaveURL('/daily')
  })
})
