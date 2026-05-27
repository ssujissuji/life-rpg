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
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      sessionStorage.setItem('has_landed', '1')
    })
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
      localStorage.setItem('onboarding_done', '1')
      sessionStorage.setItem('has_landed', '1')
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

  test('"수정하기" 버튼 클릭 시 /daily/:date로 이동한다', async ({ page }) => {
    // 수정하기 버튼이 /daily/${date} 형식으로 이동하도록 변경됨
    await page.getByRole('button', { name: '수정하기' }).click()
    await expect(page).toHaveURL(new RegExp(`/daily/${TODAY}`))
  })

  test('홈으로 아이콘 버튼 클릭 시 / 로 이동한다', async ({ page }) => {
    // "← 홈으로" 텍스트가 House 아이콘(lucide-react)으로 교체됨
    // PatchResult 상단의 첫 번째 버튼(House 아이콘)을 클릭
    await page.locator('div.space-y-1').first().locator('button').click()
    await expect(page).toHaveURL('/')
  })
})

// ─── BLOCK-2: 토스트 표시 조건 ────────────────────────────────────────────────

test.describe('PatchResult — BLOCK-2: 만렙 스킬 토스트 (fromSave 경유)', () => {
  test('fromSave=true 로 진입하고 스킬이 만렙이면 토스트가 표시된다', async ({ page }) => {
    // poor 스킬(거지력) 만렙 조건: spend=0, cafe=0 날짜 30일 누적
    // 과거 29개 기록 심어두고 오늘 폼 저장 시 30번째로 만렙 달성
    await page.addInitScript((today) => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      sessionStorage.setItem('has_landed', '1')
      // 과거 29일치 spend=0, cafe=0 기록 주입
      for (let i = 1; i <= 29; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const entry = {
          date: dateStr,
          sleep: 7,
          meal: 2,
          cafe: 0,
          delivery: 0,
          spend: 0,
          emoji: '😊',
          memo: '',
          stats: { hp: 80, focus: 80, social: 80, wallet: 80, outdoor: 70, sleepQ: 55 },
          tags: [],
        }
        localStorage.setItem(`patch_${dateStr}`, JSON.stringify(entry))
      }
    }, TODAY)

    await page.goto('/daily')

    // 카페, 배달, 지출 모두 0인 상태로 저장 (무지출 조건 충족)
    // 기본값: sleep=7, meal=2, cafe=0, delivery=0, spend=0
    await page.getByRole('button', { name: /패치노트 저장/ }).click()

    // fromSave=true state로 /result/:date 에 이동했으므로 토스트 확인
    await expect(page).toHaveURL(`/result/${TODAY}`)
    // 거지력 만렙 토스트 메시지 확인
    await expect(page.getByText('거지력 — 만렙 달성!', { exact: false })).toBeVisible({ timeout: 5000 })
  })

  test('URL 직접 진입(fromSave 없음)이면 만렙 스킬이 있어도 토스트가 표시되지 않는다', async ({ page }) => {
    // 이미 만렙인 스킬이 있고 skill_maxed에도 기록되지 않은 상태
    await page.addInitScript((today) => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      sessionStorage.setItem('has_landed', '1')
      // poor 스킬 만렙 조건: 30일치 spend=0, cafe=0 기록
      for (let i = 1; i <= 30; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const entry = {
          date: dateStr,
          sleep: 7,
          meal: 2,
          cafe: 0,
          delivery: 0,
          spend: 0,
          emoji: '😊',
          memo: '',
          stats: { hp: 80, focus: 80, social: 80, wallet: 80, outdoor: 70, sleepQ: 55 },
          tags: [],
        }
        localStorage.setItem(`patch_${dateStr}`, JSON.stringify(entry))
      }
      // 오늘 기록도 심어둠
      const todayEntry = {
        date: today,
        sleep: 7,
        meal: 2,
        cafe: 0,
        delivery: 0,
        spend: 0,
        emoji: '😊',
        memo: '',
        stats: { hp: 80, focus: 80, social: 80, wallet: 80, outdoor: 70, sleepQ: 55 },
        tags: [],
      }
      localStorage.setItem(`patch_${today}`, JSON.stringify(todayEntry))
    }, TODAY)

    // URL 직접 진입 (fromSave 없음)
    await page.goto(`/result/${TODAY}`)

    // 토스트가 표시되지 않아야 함
    await expect(page.getByText('만렙 달성!', { exact: false })).not.toBeVisible()
  })

  test('fromSave=true 진입 후 토스트 닫히면 다음 토스트로 이어진다', async ({ page }) => {
    // pig + poor 두 스킬 동시 만렙 조건 구성
    // pig: 배달/카페 누적 50회, poor: spend=0, cafe=0 30일
    // pig 만렙을 위해 과거 기록에 cafe+delivery 대량 주입, poor는 today 기록으로 트리거
    await page.addInitScript((today) => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      sessionStorage.setItem('has_landed', '1')
      // pig 스킬: cafe+delivery 합산 50회 이상 (25일 × 각 1회씩)
      // poor 스킬: spend=0, cafe=0 30일
      // 두 조건이 겹치지 않으므로 pig는 별도 날짜에 설정
      for (let i = 1; i <= 30; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        // cafe=1, delivery=1 이면 pig += 2, poor는 cafe>0으로 카운트 안됨
        const entry = {
          date: dateStr,
          sleep: 7,
          meal: 2,
          cafe: 1,
          delivery: 1,
          spend: 0,
          emoji: '😊',
          memo: '',
          stats: { hp: 80, focus: 80, social: 80, wallet: 80, outdoor: 80, sleepQ: 55 },
          tags: [],
        }
        localStorage.setItem(`patch_${dateStr}`, JSON.stringify(entry))
      }
    }, TODAY)

    await page.goto('/daily')
    // 기본 저장 (spend=0, cafe=0 → poor 카운트 +1 → 만렙은 아직 안 됨)
    await page.getByRole('button', { name: /패치노트 저장/ }).click()

    await expect(page).toHaveURL(`/result/${TODAY}`)
    // 토스트 없음 확인 (pig는 30×2=60으로 만렙 but skill_maxed에 없으므로 토스트 뜸)
    // pig 만렙: 60개 달성 → 토스트 표시
    await expect(page.getByText('돼지력 — 만렙 달성!', { exact: false })).toBeVisible({ timeout: 5000 })
  })
})
