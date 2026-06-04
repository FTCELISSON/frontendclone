import { useState, useCallback } from 'react'

const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/v1/check`

function mapVerdict(verdict) {
  if (verdict === 'false') return 'fake'
  if (verdict === 'uncertain') return 'unverified'
  return 'true'
}

export function useFakeChecker() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const check = useCallback(async (query) => {
    if (!query || query.length > 2048) return

    setMessages((prev) => [...prev, { role: 'user', text: query }])
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const body = await res.json()

      if (!res.ok) {
        throw new Error(body.message || `Erro ${res.status}`)
      }

      const { verdict, confidence, source, url } = body.data

      const result = {
        verdict:     mapVerdict(verdict),
        confidence:  Math.round(confidence * 100),
        explanation: url
          ? `Fonte consultada: ${url}`
          : 'Resultado gerado pelo modelo de machine learning.',
        sources:     [source === 'fact_api' ? 'Fact-Check API' : 'ML Model'],
        status:      body.status,
        id:          body.id,
      }

      setMessages((prev) => [...prev, { role: 'bot', statement: query, result }])
    } catch (err) {
      setError(err.message)
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }, [])

  return { messages, loading, error, check }
}