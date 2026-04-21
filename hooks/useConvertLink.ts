import { useState } from 'react'
import api from '@/lib/api'

interface ConvertResult {
  originalUrl: string
  affiliateUrl: string
  platform: string
}

export function useConvertLink() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ConvertResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const convert = async (url: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {      
      const data = await api.post('/links/convert', { url })
      setResult(data)
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message ?? 'Khong the convert link'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return { convert, isLoading, result, error, reset }
}