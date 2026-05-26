import type { SidoName, SidoCoord } from '../types'

export const SIDO_LIST: SidoName[] = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

export const SIDO_COORDS: Record<SidoName, SidoCoord> = {
  서울: { lat: 37.5665, lon: 126.9780 },
  부산: { lat: 35.1796, lon: 129.0756 },
  대구: { lat: 35.8714, lon: 128.6014 },
  인천: { lat: 37.4563, lon: 126.7052 },
  광주: { lat: 35.1595, lon: 126.8526 },
  대전: { lat: 36.3504, lon: 127.3845 },
  울산: { lat: 35.5384, lon: 129.3114 },
  경기: { lat: 37.4138, lon: 127.5183 },
  강원: { lat: 37.8813, lon: 127.7298 },
  충북: { lat: 36.6357, lon: 127.4913 },
  충남: { lat: 36.6588, lon: 126.6728 },
  전북: { lat: 35.8200, lon: 127.1089 },
  전남: { lat: 34.8679, lon: 126.9910 },
  경북: { lat: 36.5760, lon: 128.5055 },
  경남: { lat: 35.2380, lon: 128.6920 },
  제주: { lat: 33.4890, lon: 126.4983 },
  세종: { lat: 36.4801, lon: 127.2890 },
}

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

export function getWeatherLabel(pty: number, sky: number): string | null {
  if (pty === 1) return '🌧️ 비'
  if (pty === 2) return '🌨️ 진눈깨비'
  if (pty === 3) return '❄️ 눈'
  if (pty === 4) return '🌦️ 소나기'
  if (sky === 1) return '☀️ 맑음'
  if (sky === 3) return '🌤️ 구름많음'
  if (sky === 4) return '☁️ 흐림'
  return null
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
