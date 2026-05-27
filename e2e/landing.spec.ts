import { test, expect } from '@playwright/test'

// ─── Landing — 라우트 가드 동작 ──────────────────────────────────────────────

test.describe('Landing — 온보딩 미완료 상태', () => {
  test('onboarding_done 없으면 / 접근 시 /onboarding으로 리다이렉트된다', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      // onboarding_done 미설정
    })
    await page.goto('/')
    await expect(page).toHaveURL('/onboarding')
  })

  test('onboarding_done 없으면 /calendar 접근 시 /onboarding으로 리다이렉트된다', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
    })
    await page.goto('/calendar')
    await expect(page).toHaveURL('/onboarding')
  })
})

test.describe('Landing — 온보딩 완료 + has_landed 없음', () => {
  test('onboarding_done=1 이고 sessionStorage에 has_landed 없으면 / 접근 시 /landing으로 리다이렉트된다', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      // sessionStorage에 has_landed 미설정
    })
    await page.goto('/')
    await expect(page).toHaveURL('/landing')
  })
})

// ─── Landing — 화면 렌더링 ────────────────────────────────────────────────────

test.describe('Landing — 화면 렌더링', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      localStorage.setItem(
        'character',
        JSON.stringify({ name: '테스터', class: '개발자', birthYear: 1995 }),
      )
      // has_landed 미설정 → / 접근 시 /landing 리다이렉트
    })
    await page.goto('/landing')
  })

  test('/landing 직접 접근 시 TypeAnimation 텍스트 컨테이너가 렌더된다', async ({ page }) => {
    const container = page.locator('.whitespace-pre-wrap')
    await expect(container).toBeVisible()
  })

  test('/landing 접근 시 "[Y] 현생 로그인" 버튼이 표시된다', async ({ page }) => {
    await expect(page.getByRole('button', { name: '[Y] 현생 로그인' })).toBeVisible()
  })

  test('LOADING SAVE DATA 텍스트 애니메이션 시작 문구가 렌더링된다', async ({ page }) => {
    // TypeAnimation이 시작되면 첫 번째 시퀀스 문자열의 일부가 표시됨
    // 애니메이션이 완료될 때까지 기다리지 않고 컨테이너 존재만 확인
    const container = page.locator('.whitespace-pre-wrap')
    await expect(container).toBeVisible()
  })
})

// ─── Landing — 버튼 동작 ──────────────────────────────────────────────────────

test.describe('Landing — "[Y] 현생 로그인" 버튼 클릭', () => {
  test('버튼 클릭 시 sessionStorage에 has_landed=1이 저장된다', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      localStorage.setItem(
        'character',
        JSON.stringify({ name: '모험가', class: '사회인', birthYear: 2000 }),
      )
    })
    await page.goto('/landing')

    await page.getByRole('button', { name: '[Y] 현생 로그인' }).click()

    const hasLanded = await page.evaluate(() => sessionStorage.getItem('has_landed'))
    expect(hasLanded).toBe('1')
  })

  test('버튼 클릭 후 / (CharacterSheet)로 이동한다', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      localStorage.setItem(
        'character',
        JSON.stringify({ name: '모험가', class: '사회인', birthYear: 2000 }),
      )
    })
    await page.goto('/landing')

    await page.getByRole('button', { name: '[Y] 현생 로그인' }).click()

    await expect(page).toHaveURL('/')
  })
})

// ─── Landing — has_landed 있음 → CharacterSheet 바로 진입 ────────────────────

test.describe('Landing — sessionStorage has_landed=1 있을 때', () => {
  test('has_landed=1이면 / 접근 시 Landing을 거치지 않고 CharacterSheet가 렌더된다', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      sessionStorage.setItem('has_landed', '1')
    })
    await page.goto('/')

    // /landing으로 리다이렉트 되지 않아야 함
    await expect(page).toHaveURL('/')

    // CharacterSheet 기본 요소 확인
    await expect(page.getByText('모험가')).toBeVisible()
  })

  test('has_landed=1이면 / 접근 시 URL이 /landing으로 변경되지 않는다', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      sessionStorage.setItem('has_landed', '1')
    })
    await page.goto('/')

    await expect(page).not.toHaveURL('/landing')
  })
})

// ─── Settings — About 섹션 ────────────────────────────────────────────────────

test.describe('Settings — About 섹션', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('onboarding_done', '1')
      sessionStorage.setItem('has_landed', '1')
    })
    await page.goto('/settings')
  })

  test('About 섹션 헤더 "ABOUT"이 표시된다', async ({ page }) => {
    await expect(page.getByText('ABOUT')).toBeVisible()
  })

  test('"현생 RPG v1.0.0" 버전 정보가 표시된다', async ({ page }) => {
    await expect(page.getByText('현생 RPG v1.0.0')).toBeVisible()
  })

  test('"Made by Suji" 크레딧이 표시된다', async ({ page }) => {
    await expect(page.getByText('Made by Suji')).toBeVisible()
  })
})
