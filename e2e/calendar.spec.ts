import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear()
    localStorage.setItem('onboarding_done', '1')
    sessionStorage.setItem('has_landed', '1')
  })
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
  test('.react-calendar__tile:enabled:hover CSS 규칙의 배경색이 #1e1e2e로 정의되어 있다', async ({ page }) => {
    // calendar.css 파일에서 .react-calendar__tile:enabled:hover 규칙 확인
    const hoverBg = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText === '.react-calendar__tile:enabled:hover'
            ) {
              return (rule as CSSStyleRule).style.backgroundColor
            }
          }
        } catch {
          // cross-origin 무시
        }
      }
      return null
    })
    // calendar.css: .react-calendar__tile:enabled:hover { background: #1e1e2e }
    // rgb(30, 30, 46) = #1e1e2e
    expect(hoverBg).toBe('rgb(30, 30, 46)')
  })

  test('날짜 타일 hover CSS 규칙이 존재한다 (calendar.css)', async ({ page }) => {
    // .react-calendar__tile:enabled:hover { background: #1e1e2e; color: #afa9ec } 규칙 확인
    // CSS styleSheet를 직접 검사하는 방식으로 규칙 존재 여부만 확인
    const hasHoverRule = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText?.includes('.react-calendar__tile') &&
              rule.selectorText?.includes('hover')
            ) {
              return true
            }
          }
        } catch {
          // cross-origin stylesheet 등은 무시
        }
      }
      return false
    })
    expect(hasHoverRule).toBe(true)
  })

  test('오늘 타일은 box-shadow(inset)가 기본으로 적용되어 있다', async ({ page }) => {
    // --now 타일은 hover 없이도 inset box-shadow가 적용됨 (calendar.css)
    const todayTile = page.locator('.react-calendar__tile--now')

    const shadow = await todayTile.evaluate((el) => getComputedStyle(el).boxShadow)
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
