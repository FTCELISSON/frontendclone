import { useState, useCallback } from 'react'
 
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_ENDPOINT = `${BASE_URL}/v1/check`
 
const MOCK_RESPONSES = [
  {
    keywords: ['vacina', 'infertilidade', 'autismo', 'microchip'],
    verdict: 'false',
    confidence: 0.94,
    source: 'ml',
    explanation: 'Não há evidências científicas que sustentem essa afirmação. Agências como OMS, FDA e Anvisa refutam essa relação.',
    sources: ['OMS', 'Anvisa', 'The Lancet', 'PubMed'],
  },
  {
    keywords: ['5g', 'vírus', 'coronavirus', 'coronavírus', 'radiação'],
    verdict: 'false',
    confidence: 0.98,
    source: 'ml',
    explanation: 'Ondas de rádio não transportam vírus. Essa narrativa foi desmentida por físicos e virologistas.',
    sources: ['OMS', 'ICNIRP', 'Nature'],
  },
  {
    keywords: ['soja', 'exportador', 'brasil'],
    verdict: 'true',
    confidence: 0.89,
    source: 'fact_api',
    explanation: 'O Brasil é o maior produtor e exportador de soja do mundo desde 2012, confirmado pela CONAB.',
    sources: ['CONAB', 'USDA', 'Embrapa'],
  },
  {
    keywords: ['terra', 'plana'],
    verdict: 'false',
    confidence: 0.99,
    source: 'ml',
    explanation: 'A Terra tem formato geoide, fato confirmado por astronomia, física e imagens espaciais.',
    sources: ['NASA', 'ESA', 'INPE'],
  },
]
 
function getMockResult(text) {
  const lower = text.toLowerCase()
  for (const r of MOCK_RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return r
  }
  return {
    verdict: 'uncertain',
    confidence: 0.51,
    source: 'ml',
    explanation: 'Não foi possível confirmar ou refutar com alta confiança. Recomenda-se verificar em fontes primárias.',
    sources: ['Fact-Check API', 'ML Fallback'],
  }
}
 

function mapVerdict(verdict) {
  if (verdict === 'false') return 'fake'
  if (verdict === 'uncertain') return 'unverified'
  return 'true'
}
 
export function useFakeChecker() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
 
  const check = useCallback(async (query) => {
  
    if (!query || query.length > 2048) return
 
    setMessages((prev) => [...prev, { role: 'user', text: query }])
    setLoading(true)
 
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600))
 
    let result
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),  // campo "query" conforme contrato
      })
 
      if (res.ok) {
      
        const body = await res.json()
        const { verdict, confidence, source, url } = body.data
 
        result = {
          verdict:     mapVerdict(verdict),
          confidence:  Math.round(confidence * 100),
          explanation: url
            ? `Fonte consultada: ${url}`
            : 'Resultado gerado pelo modelo de machine learning.',
          sources:     [source === 'fact_api' ? 'Fact-Check API' : 'ML Model'],
          status:      body.status, 
          id:          body.id,
        }
      } else {
        const err = await res.json().catch(() => ({}))
 
        if (res.status === 400) {
       
          console.warn('Payload inválido:', err.message)
        } else if (res.status === 503) {
        
          console.warn('Provedores indisponíveis:', err.message)
        } else {
          console.warn(`Erro ${res.status}:`, err)
        }
 
        const mock = getMockResult(query)
        result = {
          verdict:     mapVerdict(mock.verdict),
          confidence:  Math.round(mock.confidence * 100),
          explanation: mock.explanation,
          sources:     mock.sources,
          status:      'predicted',
          id:          null,
        }
      }
    } catch {
    
      const mock = getMockResult(query)
      result = {
        verdict:     mapVerdict(mock.verdict),
        confidence:  Math.round(mock.confidence * 100),
        explanation: mock.explanation,
        sources:     mock.sources,
        status:      'predicted',
        id:          null,
      }
    }
 
    setMessages((prev) => [...prev, { role: 'bot', statement: query, result }])
    setLoading(false)
  }, [])
 
  return { messages, loading, check }
}