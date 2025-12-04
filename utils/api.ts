import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types'

const CACHE_DURATION = 30000 // 30 seconds default cache
const cache = new Map<string, { data: any; timestamp: number }>()

export const fetchApiData = async (
  url: string,
  cacheDuration: number = CACHE_DURATION
): Promise<ApiResponse> => {
  const cacheKey = url
  const cached = cache.get(cacheKey)

  // Check if cached data is still valid
  if (cached && Date.now() - cached.timestamp < cacheDuration) {
    return {
      data: cached.data,
      timestamp: cached.timestamp,
      cached: true,
    }
  }

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = response.data
    const timestamp = Date.now()

    // Cache the response
    cache.set(cacheKey, { data, timestamp })

    return {
      data,
      timestamp,
      cached: false,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response) {
      throw new Error(
        `API Error: ${axiosError.response.status} - ${axiosError.response.statusText}`
      )
    } else if (axiosError.request) {
      throw new Error('Network Error: Unable to reach the API')
    } else {
      throw new Error(`Request Error: ${axiosError.message}`)
    }
  }
}

export const validateApiUrl = async (url: string): Promise<boolean> => {
  try {
    await fetchApiData(url, 0) // No cache for validation
    return true
  } catch {
    return false
  }
}

export const clearCache = (url?: string) => {
  if (url) {
    cache.delete(url)
  } else {
    cache.clear()
  }
}

