import { test, expect } from '@playwright/test'

function localDateStr(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── Analysis — 기록 없을 때 ──────────────────────────────────────────────────

test.describe('Analysis — 기록 없을 때', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
    })
    await page.goto('/analysis')
  })

  test('"분석" 페이지 헤더가 표시된다', async ({ page }) => {
    // 바텀 네비의 span과 구분하기 위해 페이지 헤더 div를 직접 targeting
    await expect(page.locator('div.text-white.font-mono.font-bold.text-xl').filter({ hasText: '분석' })).toBeVisible()
  })

  test('empty state: "아직 기록이 없어요" 메시지가 표시된다', async ({ page }) => {
    await expect(page.getByText('아직 기록이 없어요')).toBeVisible()
  })

  test('empty state: 안내 문구가 표시된다', async ({ page }) => {
    await expect(page.getByText(/패치노트를 꾸준히 쌓으면/)).toBeVisible()
  })

  test('empty state: 주간/월간 탭이 표시되지 않는다', async ({ page }) => {
    await expect(page.getByRole('button', { name: '주간' })).not.toBeVisible()
    await expect(page.getByRole('button', { name: '월간' })).not.toBeVisible()
  })
})

// ─── Analysis — 기록 있을 때 ──────────────────────────────────────────────────

test.describe('Analysis — 기록 있을 때', () => {
  test.beforeEach(async ({ page }) => {
    const today = localDateStr()

    await page.addInitScript((dateStr) => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      const entry = {
        date: dateStr,
        sleep: 7,
        meal: 2,
        cafe: 0,
        delivery: 0,
        spend: 0,
        emoji: '😊',
        memo: '',
        stats: { hp: 100, focus: 100, social: 80, wallet: 100, outdoor: 70, sleepQ: 55 },
        tags: [],
      }
      localStorage.setItem(`patch_${dateStr}`, JSON.stringify(entry))
    }, today)

    await page.goto('/analysis')
  })

  test('주간 탭이 기본으로 활성화된다', async ({ page }) => {
    const weeklyBtn = page.getByRole('button', { name: '주간' })
    await expect(weeklyBtn).toBeVisible()
    await expect(weeklyBtn).toHaveClass(/bg-purple-primary/)
  })

  test('주간 탭 활성 시 WeeklyReportCard가 표시된다', async ({ page }) => {
    await expect(page.getByText('출석:')).toBeVisible()
  })

  test('월간 탭 클릭 → 월간 컨텐츠로 전환된다', async ({ page }) => {
    await page.getByRole('button', { name: '월간' }).click()

    // 월간 탭 활성화 확인
    await expect(page.getByRole('button', { name: '월간' })).toHaveClass(/bg-purple-primary/)

    // MonthlyReportCard: 년/월 텍스트 포함 (첫 번째 일치 요소로 확인)
    const d = new Date()
    const yearMonthRegex = new RegExp(`${d.getFullYear()}년 ${d.getMonth() + 1}월`)
    await expect(page.getByText(yearMonthRegex).first()).toBeVisible()
  })

  test('월간 탭 클릭 후 주간 탭 다시 클릭 → 주간 컨텐츠가 다시 표시된다', async ({ page }) => {
    await page.getByRole('button', { name: '월간' }).click()
    await page.getByRole('button', { name: '주간' }).click()

    await expect(page.getByRole('button', { name: '주간' })).toHaveClass(/bg-purple-primary/)
    await expect(page.getByText('출석:')).toBeVisible()
  })

  test('주간 탭: 스킬 레벨 섹션이 표시된다', async ({ page }) => {
    await expect(page.getByText('스킬 레벨')).toBeVisible()
  })

  test('월간 탭: 출석 정보가 표시된다', async ({ page }) => {
    await page.getByRole('button', { name: '월간' }).click()
    await expect(page.getByText('출석')).toBeVisible()
  })
})

// ─── Analysis — 네비게이션 ────────────────────────────────────────────────────

test.describe('Analysis — 바텀 네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
    })
    await page.goto('/analysis')
  })

  test('바텀 네비에서 "분석" 탭이 활성화 색상으로 표시된다', async ({ page }) => {
    // BottomNav의 분석 NavLink가 활성화됨
    const analysisNavLink = page.locator('nav').getByText('분석')
    await expect(analysisNavLink).toBeVisible()
    // 부모 NavLink에 text-purple-light 클래스 확인
    const navLink = page.locator('nav a[href="/analysis"]')
    await expect(navLink).toHaveClass(/text-purple-light/)
  })
})

// ─── Analysis — 날짜 네비게이션 ──────────────────────────────────────────────

test.describe('Analysis — 날짜 네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    const today = localDateStr()

    await page.addInitScript((dateStr) => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      const entry = {
        date: dateStr,
        sleep: 7,
        meal: 2,
        cafe: 0,
        delivery: 0,
        spend: 0,
        emoji: '😊',
        memo: '',
        stats: { hp: 100, focus: 100, social: 80, wallet: 100, outdoor: 70, sleepQ: 55 },
        tags: [],
      }
      localStorage.setItem(`patch_${dateStr}`, JSON.stringify(entry))
    }, today)

    await page.goto('/analysis')
  })

  test('주간 탭: "< 이전 주" 버튼 클릭 시 레이블이 이전 주로 변경된다', async ({ page }) => {
    // 초기 레이블을 읽어둠
    const initialLabel = await page.locator('span.font-mono.text-center').first().textContent()

    // 이전 주 버튼 클릭
    await page.getByRole('button', { name: /이전 주/ }).click()

    // 레이블이 변경되었는지 확인
    const updatedLabel = await page.locator('span.font-mono.text-center').first().textContent()
    expect(updatedLabel).not.toBe(initialLabel)
    // MM/DD ~ MM/DD 형식 유지 확인
    expect(updatedLabel).toMatch(/\d{2}\/\d{2} ~ \d{2}\/\d{2}/)
  })

  test('주간 탭: "다음 주 >" 버튼이 현재 주일 때 disabled 상태이다', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /다음 주/ })
    await expect(nextBtn).toBeDisabled()
  })

  test('주간 탭: 이전 주로 이동하면 "다음 주 >" 버튼이 활성화된다', async ({ page }) => {
    await page.getByRole('button', { name: /이전 주/ }).click()

    const nextBtn = page.getByRole('button', { name: /다음 주/ })
    await expect(nextBtn).not.toBeDisabled()
  })

  test('주간 탭: 이전 주 → 다음 주 클릭 시 레이블이 원래 주로 돌아온다', async ({ page }) => {
    const initialLabel = await page.locator('span.font-mono.text-center').first().textContent()

    await page.getByRole('button', { name: /이전 주/ }).click()
    await page.getByRole('button', { name: /다음 주/ }).click()

    const restoredLabel = await page.locator('span.font-mono.text-center').first().textContent()
    expect(restoredLabel).toBe(initialLabel)
  })

  test('월간 탭: "< 이전 달" 클릭 시 레이블이 이전 달로 변경된다', async ({ page }) => {
    await page.getByRole('button', { name: '월간' }).click()

    // 초기 레이블
    const initialLabel = await page.locator('span.font-mono.text-center').first().textContent()

    // 이전 달 버튼 클릭
    await page.getByRole('button', { name: /이전 달/ }).click()

    const updatedLabel = await page.locator('span.font-mono.text-center').first().textContent()
    expect(updatedLabel).not.toBe(initialLabel)
    // YYYY년 M월 형식 확인
    expect(updatedLabel).toMatch(/\d{4}년 \d{1,2}월/)
  })

  test('월간 탭: "다음 달 >" 버튼이 현재 달일 때 disabled 상태이다', async ({ page }) => {
    await page.getByRole('button', { name: '월간' }).click()

    const nextBtn = page.getByRole('button', { name: /다음 달/ })
    await expect(nextBtn).toBeDisabled()
  })

  test('월간 탭: 이전 달로 이동하면 "다음 달 >" 버튼이 활성화된다', async ({ page }) => {
    await page.getByRole('button', { name: '월간' }).click()
    await page.getByRole('button', { name: /이전 달/ }).click()

    const nextBtn = page.getByRole('button', { name: /다음 달/ })
    await expect(nextBtn).not.toBeDisabled()
  })

  test('월간 탭: 이전 달 → 다음 달 클릭 시 레이블이 원래 달로 돌아온다', async ({ page }) => {
    await page.getByRole('button', { name: '월간' }).click()
    const initialLabel = await page.locator('span.font-mono.text-center').first().textContent()

    await page.getByRole('button', { name: /이전 달/ }).click()
    await page.getByRole('button', { name: /다음 달/ }).click()

    const restoredLabel = await page.locator('span.font-mono.text-center').first().textContent()
    expect(restoredLabel).toBe(initialLabel)
  })
})

// ─── Analysis — 여러 기록이 있을 때 주간 리포트 ───────────────────────────────

test.describe('Analysis — 주간 리포트 여러 기록', () => {
  test.beforeEach(async ({ page }) => {
    const today = localDateStr()

    await page.addInitScript((dateStr) => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      // 오늘 포함 최근 3일 기록 생성
      for (let i = 0; i < 3; i++) {
        const d = new Date(dateStr)
        d.setDate(d.getDate() - i)
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const entry = {
          date: ds,
          sleep: 7,
          meal: 2,
          cafe: 0,
          delivery: 0,
          spend: 0,
          emoji: '😊',
          memo: '',
          stats: { hp: 100, focus: 100, social: 80, wallet: 100, outdoor: 70, sleepQ: 55 },
          tags: [],
        }
        localStorage.setItem(`patch_${ds}`, JSON.stringify(entry))
      }
    }, today)

    await page.goto('/analysis')
  })

  test('출석 기록 수가 표시된다', async ({ page }) => {
    // "출석: N/7일 기록" 형식
    await expect(page.getByText(/출석:.*\/7일 기록/)).toBeVisible()
  })

  test('MVP 스탯이 표시된다', async ({ page }) => {
    await expect(page.getByText(/MVP 스탯:/)).toBeVisible()
  })
})
