import { test, expect } from '@playwright/test'

function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const TODAY = localToday()

const SAMPLE_ENTRY = {
  date: TODAY,
  sleep: 7.5,
  meal: 2,
  cafe: 1,
  delivery: 0,
  spend: 15000,
  emoji: '😊',
  memo: '좋은 하루',
  stats: { hp: 75, focus: 65, social: 55, wallet: 70, outdoor: 60, sleepQ: 75 },
  tags: [],
}

test.describe('PatchResult — 기록 없을 때', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear())
    await page.goto(`/result/2000-01-01`)
  })

  test('"해당 날짜의 기록이 없습니다" 안내가 표시된다', async ({ page }) => {
    await expect(page.getByText('해당 날짜의 기록이 없습니다.')).toBeVisible()
  })

  test('"패치노트 작성하기" 버튼 클릭 시 /daily로 이동한다', async ({ page }) => {
    await page.getByRole('button', { name: '패치노트 작성하기' }).click()
    await expect(page).toHaveURL('/daily')
  })
})

test.describe('PatchResult — 기록 있을 때', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((entry) => {
      localStorage.clear()
      localStorage.setItem(`patch_${entry.date}`, JSON.stringify(entry))
    }, SAMPLE_ENTRY)
    await page.goto(`/result/${TODAY}`)
  })

  test('날짜 레이블이 v YYYY.MM.DD 형식으로 표시된다', async ({ page }) => {
    const version = `v${TODAY.replace(/-/g, '.')}`
    await expect(page.getByText(new RegExp(version))).toBeVisible()
  })

  test('이모지가 표시된다', async ({ page }) => {
    await expect(page.getByText('😊')).toBeVisible()
  })

  test('[능력치 변화] 섹션이 표시된다', async ({ page }) => {
    await expect(page.getByText('[능력치 변화]')).toBeVisible()
  })

  test('[오늘의 기록] 섹션에 수면, 식사, 지출이 표시된다', async ({ page }) => {
    await expect(page.getByText('[오늘의 기록]')).toBeVisible()
    await expect(page.getByText('7.5시간')).toBeVisible()
    await expect(page.getByText('2끼')).toBeVisible()
    await expect(page.getByText('1만 5천원')).toBeVisible()
  })

  test('메모가 표시된다', async ({ page }) => {
    await expect(page.getByText('"좋은 하루"')).toBeVisible()
  })

  test('"수정하기" 버튼 클릭 시 /daily로 이동한다', async ({ page }) => {
    await page.getByRole('button', { name: '수정하기' }).click()
    await expect(page).toHaveURL('/daily')
  })

  test('"← 홈으로" 클릭 시 / 로 이동한다', async ({ page }) => {
    await page.getByText('← 홈으로').click()
    await expect(page).toHaveURL('/')
  })
})
