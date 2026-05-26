import type { VercelRequest, VercelResponse } from '@vercel/node';

function getSidoName(lat: number, lon: number): string {
  if (lat >= 37.4 && lat <= 37.7 && lon >= 126.7 && lon <= 127.3) return '서울';
  if (lat >= 35.0 && lat < 35.4 && lon >= 128.9 && lon <= 129.3) return '부산';
  if (lat >= 35.8 && lat < 36.1 && lon >= 128.4 && lon <= 128.7) return '대구';
  if (lat >= 35.5 && lat < 35.8 && lon >= 126.7 && lon <= 127.1) return '광주';
  if (lat >= 36.3 && lat < 36.5 && lon >= 127.3 && lon <= 127.5) return '대전';
  return '서울';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const key = process.env.AIRKOREA_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'AIRKOREA_API_KEY not configured' });
    return;
  }

  const rawLat = req.query.lat;
  const rawLon = req.query.lon;
  const lat = typeof rawLat === 'string' ? parseFloat(rawLat) : NaN;
  const lon = typeof rawLon === 'string' ? parseFloat(rawLon) : NaN;
  const sidoName =
    !isNaN(lat) && !isNaN(lon) ? getSidoName(lat, lon) : '서울';

  try {
    const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${key}&sidoName=${encodeURIComponent(sidoName)}&pageNo=1&numOfRows=1&returnType=json&ver=1.0`;
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=300');
    res.json(data);
  } catch {
    res.status(502).json({ error: 'Failed to fetch AirKorea data' });
  }
}
