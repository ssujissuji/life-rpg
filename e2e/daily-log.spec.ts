import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())
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

  test('"패치노트 저장 →" 제출 버튼이 표시된다', async ({ page }) => {
    await expect(page.getByRole('button', { name: '패치노트 저장 →' })).toBeVisible()
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
    await page.getByRole('button', { name: '패치노트 저장 →' }).click()

    const d = new Date()
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    await expect(page).toHaveURL(`/result/${today}`)
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
