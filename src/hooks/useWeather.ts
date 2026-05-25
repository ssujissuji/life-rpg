import { useState, useEffect } from 'react'

interface UseWeatherResult {
  weatherLabel: string | null
  aqiLabel: string | null
  isLoading: boolean
  error: boolean
}

interface WeatherApiResponse {
  weather: { id: number }[]
}

interface AqiApiResponse {
  list: { main: { aqi: number } }[]
}

const SEOUL_LAT = 37.5665
const SEOUL_LON = 126.978
const TIMEOUT_MS = 5000

function mapWeatherCode(id: number): string {
  if (id >= 200 && id <= 299) return '⛈️ 뇌우'
  if (id >= 300 && id <= 399) return '🌦️ 이슬비'
  if (id >= 500 && id <= 504) return '🌧️ 비'
  if (id === 511) return '🌨️ 얼음비'
  if (id >= 520 && id <= 531) return '🌦️ 소나기'
  if (id >= 600 && id <= 699) return '❄️ 눈'
  if (id >= 700 && id <= 781) return '🌫️ 안개'
  if (id === 800) return '☀️ 맑음'
  if (id === 801) return '🌤️ 구름 조금'
  if (id === 802) return '⛅ 구름 많음'
  if (id >= 803 && id <= 804) return '☁️ 흐림'
  return '🌈 기타'
}

function mapAqi(aqi: number): string {
  if (aqi === 1) return '💚 좋음'
  if (aqi === 2) return '💛 보통'
  if (aqi === 3) return '🟠 나쁨'
  return '😷 매우나쁨'
}

async function fetchWeatherData(
  lat: number,
  lon: number,
  key: string,
  signal: AbortSignal
): Promise<{ weatherLabel: string; aqiLabel: string }> {
  const [weatherRes, aqiRes] = await Promise.all([
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=kr`,
      { signal }
    ),
    fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`,
      { signal }
    ),
  ])

  const weatherData = (await weatherRes.json()) as WeatherApiResponse
  const aqiData = (await aqiRes.json()) as AqiApiResponse

  const weatherId = weatherData.weather[0]?.id ?? 800
  const aqiValue = aqiData.list[0]?.main?.aqi ?? 1

  return {
    weatherLabel: mapWeatherCode(weatherId),
    aqiLabel: mapAqi(aqiValue),
  }
}

export function useWeather(): UseWeatherResult {
  const [weatherLabel, setWeatherLabel] = useState<string | null>(null)
  const [aqiLabel, setAqiLabel] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined
    if (!key) return

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      setError(true)
      setIsLoading(false)
    }, TIMEOUT_MS)

    setIsLoading(true)

    const run = async (lat: number, lon: number) => {
      try {
        const result = await fetchWeatherData(lat, lon, key, controller.signal)
        clearTimeout(timeoutId)
        setWeatherLabel(result.weatherLabel)
        setAqiLabel(result.aqiLabel)
        setIsLoading(false)
      } catch {
        clearTimeout(timeoutId)
        if (!controller.signal.aborted) {
          setError(true)
          setIsLoading(false)
        }
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        run(pos.coords.latitude, pos.coords.longitude)
      },
      () => {
        run(SEOUL_LAT, SEOUL_LON)
      }
    )

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  return { weatherLabel, aqiLabel, isLoading, error }
}
