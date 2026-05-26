import { useState, useEffect } from 'react'
import { latlonToGrid, getKmaBaseDateTime, mapKmaWeather, mapKhaiGrade, SIDO_COORDS } from '../lib/weather'
import useStore from '../store/useStore'
import type { SidoName } from '../types'

interface UseWeatherResult {
  weatherLabel: string | null
  aqiLabel: string | null
  isLoading: boolean
  error: boolean
}

const SEOUL_LAT = 37.5665
const SEOUL_LON = 126.978
const TIMEOUT_MS = 5000

export function useWeather(): UseWeatherResult {
  const { region } = useStore()
  const [weatherLabel, setWeatherLabel] = useState<string | null>(null)
  const [aqiLabel, setAqiLabel] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      setIsLoading(false)
    }, TIMEOUT_MS)

    async function fetchAll(lat: number, lon: number, sidoName?: SidoName) {
      const { base_date, base_time } = getKmaBaseDateTime()
      const { nx, ny } = latlonToGrid(lat, lon)

      const airkoreaUrl = sidoName
        ? `/api/airkorea?sidoName=${encodeURIComponent(sidoName)}`
        : `/api/airkorea?lat=${lat}&lon=${lon}`

      const [weatherResult, aqiResult] = await Promise.allSettled([
        fetch(`/api/weather?nx=${nx}&ny=${ny}&base_date=${base_date}&base_time=${base_time}`, { signal: controller.signal })
          .then(r => r.json()),
        fetch(airkoreaUrl, { signal: controller.signal })
          .then(r => r.json()),
      ])

      clearTimeout(timeoutId)

      if (weatherResult.status === 'fulfilled') {
        const items = weatherResult.value?.response?.body?.items?.item as { category: string; obsrValue: string }[] | undefined
        const ptyItem = items?.find(i => i.category === 'PTY')
        if (ptyItem) {
          const label = mapKmaWeather(parseInt(ptyItem.obsrValue, 10))
          if (label) setWeatherLabel(label)
        }
      }

      if (aqiResult.status === 'fulfilled') {
        const items = aqiResult.value?.response?.body?.items as { khaiGrade: string }[] | undefined
        const grade = parseInt(items?.[0]?.khaiGrade ?? '', 10)
        const label = mapKhaiGrade(grade)
        if (label) setAqiLabel(label)
      }

      const bothFailed = weatherResult.status === 'rejected' && aqiResult.status === 'rejected'
      if (bothFailed) setError(true)
      setIsLoading(false)
    }

    if (region && SIDO_COORDS[region]) {
      const { lat, lon } = SIDO_COORDS[region]
      fetchAll(lat, lon, region)
    } else {
      navigator.geolocation.getCurrentPosition(
        pos => { fetchAll(pos.coords.latitude, pos.coords.longitude) },
        () => { fetchAll(SEOUL_LAT, SEOUL_LON) }
      )
    }

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [region])

  return { weatherLabel, aqiLabel, isLoading, error }
}
