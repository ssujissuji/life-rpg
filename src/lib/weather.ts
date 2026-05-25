const RE = 6371.00877
const GRID = 5.0
const SLAT1 = 30.0
const SLAT2 = 60.0
const OLON = 126.0
const OLAT = 38.0
const XO = 43
const YO = 136

export function latlonToGrid(lat: number, lon: number): { nx: number; ny: number } {
  const DEGRAD = Math.PI / 180.0
  const re = RE / GRID
  const slat1 = SLAT1 * DEGRAD
  const slat2 = SLAT2 * DEGRAD
  const olon = OLON * DEGRAD
  const olat = OLAT * DEGRAD

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn)
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5)
  ro = (re * sf) / Math.pow(ro, sn)

  const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5)
  const r = (re * sf) / Math.pow(ra, sn)
  let theta = lon * DEGRAD - olon
  if (theta > Math.PI) theta -= 2.0 * Math.PI
  if (theta < -Math.PI) theta += 2.0 * Math.PI
  theta *= sn

  return {
    nx: Math.floor(r * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - r * Math.cos(theta) + YO + 0.5),
  }
}

export function getKmaBaseDateTime(): { base_date: string; base_time: string } {
  const now = new Date()
  let hour = now.getHours()
  const minute = now.getMinutes()

  if (minute < 40) hour -= 1

  let date = now
  if (hour < 0) {
    hour = 23
    date = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  const base_date = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const base_time = `${pad(hour)}00`

  return { base_date, base_time }
}

export function mapKmaWeather(pty: number): string | null {
  switch (pty) {
    case 0: return '☀️ 맑음'
    case 1: return '🌧️ 비'
    case 2: return '🌨️ 진눈깨비'
    case 3: return '❄️ 눈'
    case 4: return '🌦️ 소나기'
    default: return null
  }
}

export function mapKhaiGrade(grade: number): string | null {
  switch (grade) {
    case 1: return '💚 좋음'
    case 2: return '💛 보통'
    case 3: return '🟠 나쁨'
    case 4: return '😷 매우나쁨'
    default: return null
  }
}
