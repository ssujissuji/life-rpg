import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear()
    localStorage.setItem('onboarding_done', '1')
    sessionStorage.setItem('has_landed', '1')
  })
  await page.goto('/')
})

test.describe('CharacterSheet — 기본 렌더링', () => {
  test('기본 캐릭터명과 클래스가 표시된다', async ({ page }) => {
    await expect(page.getByText('모험가')).toBeVisible()
    await expect(page.getByText('사회인')).toBeVisible()
  })

  test('레벨(Lv.)과 다음 레벨까지 일수가 표시된다', async ({ page }) => {
    await expect(page.getByText('Lv.', { exact: true })).toBeVisible()
    await expect(page.getByText(/다음 레벨까지 \d+일/)).toBeVisible()
  })

  test('기록 없을 때 스탯 안내 문구가 표시된다', async ({ page }) => {
    await expect(page.getByText('패치노트를 작성하면 스탯이 쌓입니다.')).toBeVisible()
  })

  test('"오늘의 패치노트 작성" 버튼이 표시된다', async ({ page }) => {
    await expect(page.getByText('오늘의 패치노트 작성')).toBeVisible()
  })
})

test.describe('CharacterSheet — 네비게이션', () => {
  test('"오늘의 패치노트 작성" 클릭 시 /daily로 이동한다', async ({ page }) => {
    await page.getByText('오늘의 패치노트 작성').click()
    await expect(page).toHaveURL('/daily')
  })

  test('설정 아이콘 버튼 클릭 시 /settings로 이동한다', async ({ page }) => {
    // Settings 아이콘 버튼 (lucide-react로 교체됨, 텍스트 없음)
    // 캐릭터 프로필 카드의 우상단 버튼 클릭
    await page.locator('.bg-bg-card').first().locator('button').click()
    await expect(page).toHaveURL('/settings')
  })
})

test.describe('CharacterSheet — 기록 있을 때', () => {
  test('기록 있으면 "오늘 패치노트 수정하기" 버튼이 표시된다', async ({ page }) => {
    const d = new Date()
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    await page.addInitScript((dateStr) => {
      const entry = {
        date: dateStr,
        sleep: 7,
        meal: 2,
        cafe: 0,
        delivery: 0,
        spend: 0,
        emoji: '😊',
        memo: '',
        stats: { hp: 70, focus: 60, social: 50, wallet: 80, outdoor: 60, sleepQ: 70 },
        tags: [],
      }
      localStorage.setItem(`patch_${dateStr}`, JSON.stringify(entry))
    }, today)

    await page.goto('/')
    await expect(page.getByText('오늘 패치노트 수정하기')).toBeVisible()
  })
})
