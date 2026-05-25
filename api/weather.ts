import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.KMA_API_KEY
  if (!key) {
    res.status(500).json({ error: 'KMA_API_KEY not configured' })
    return
  }

  const { nx, ny, base_date, base_time } = req.query
  if (
    typeof nx !== 'string' ||
    typeof ny !== 'string' ||
    typeof base_date !== 'string' ||
    typeof base_time !== 'string'
  ) {
    res.status(400).json({ error: 'Missing required query params' })
    return
  }

  try {
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${key}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`
    const response = await fetch(url)
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=300')
    res.json(data)
  } catch {
    res.status(502).json({ error: 'Failed to fetch KMA data' })
  }
}
