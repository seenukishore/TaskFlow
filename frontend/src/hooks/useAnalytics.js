import { useState, useEffect } from 'react'
import { analyticsService } from '../services/projects'

export default function useAnalytics(orgId) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orgId) fetchAnalytics()
  }, [orgId])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await analyticsService.getAnalytics(orgId)
      setAnalytics(data)
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { analytics, loading, error, refetch: fetchAnalytics }
}