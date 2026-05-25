import type { VercelRequest, VercelResponse } from '@vercel/node'

function getStationName(lat: number, lon: number): string {
  if (lat >= 37.4 && lat <= 37.7 && lon >= 126.7 && lon <= 127.3) return '종로구'
  if (lat >= 35.0 && lat < 35.4 && lon >= 128.9 && lon <= 129.3) return '연제구'
  if (lat >= 35.8 && lat < 36.1 && lon >= 128.4 && lon <= 128.7) return '수성구'
  if (lat >= 35.5 && lat < 35.8 && lon >= 126.7 && lon <= 127.1) return '완산구'
  if (lat >= 36.3 && lat < 36.5 && lon >= 127.3 && lon <= 127.5) return '서구'
  return '종로구'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.AIRKOREA_API_KEY
  if (!key) {
    res.status(500).json({ error: 'AIRKOREA_API_KEY not configured' })
    return
  }

  const rawLat = req.query.lat
  const rawLon = req.query.lon
  const lat = typeof rawLat === 'string' ? parseFloat(rawLat) : NaN
  const lon = typeof rawLon === 'string' ? parseFloat(rawLon) : NaN
  const stationName = (!isNaN(lat) && !isNaN(lon)) ? getStationName(lat, lon) : '종로구'

  try {
    const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${key}&stationName=${encodeURIComponent(stationName)}&dataTerm=DAILY&pageNo=1&numOfRows=1&returnType=json&ver=1.0`
    const response = await fetch(url)
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=300')
    res.json(data)
  } catch {
    res.status(502).json({ error: 'Failed to fetch AirKorea data' })
  }
}
