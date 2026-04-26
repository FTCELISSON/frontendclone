import { useState, useCallback } from 'react'

const API_ENDPOINT = 'http://localhost:8000/check'

const MOCK_RESPONSES = [
  {
    keywords: ['vacina', 'infertilidade', 'autismo', 'microchip'],
    verdict: 'fake',
    confidence: 94,
    explanation:
      'Não há evidências científicas que sustentem essa afirmação. Múltiplos estudos revisados por pares e agências regulatórias internacionais (OMS, FDA, Anvisa) refutam essa relação. A alegação circula em redes sociais sem base factual.',
    sources: ['OMS', 'Anvisa', 'The Lancet', 'PubMed'],
  },
  {
    keywords: ['5g', 'vírus', 'coronavirus', 'coronavírus', 'radiação'],
    verdict: 'fake',
    confidence: 98,
    explanation:
      'Ondas de rádio não transportam nem ativam vírus. O coronavírus é um agente biológico e não pode ser transmitido por frequências eletromagnéticas. Essa narrativa foi amplamente desmentida por físicos e virologistas.',
    sources: ['OMS', 'ICNIRP', 'Nature', 'BBC Verify'],
  },
  {
    keywords: ['soja', 'exportador', 'brasil'],
    verdict: 'true',
    confidence: 89,
    explanation:
      'Correto. O Brasil é o maior produtor e exportador de soja do mundo desde 2012, superando os EUA. Dados da CONAB e do Ministério da Agricultura confirmam essa posição.',
    sources: ['CONAB', 'USDA', 'Embrapa', 'Reuters'],
  },
  {
    keywords: ['terra', 'plana'],
    verdict: 'fake',
    confidence: 99,
    explanation:
      'A Terra tem formato geoide (aproximadamente esférico), fato confirmado há séculos por astronomia, navegação, física e imagens espaciais. Não há qualquer evidência científica que suporte a hipótese da Terra plana.',
    sources: ['NASA', 'ESA', 'INPE', 'Sociedade Astronômica'],
  },
]

function getMockResponse(text) {
  const lower = text.toLowerCase()
  for (const r of MOCK_RESPONSES) {
    if (r.keywords.some((k) => lower.includes(k))) return r
  }
  return {
    verdict: 'unverified',
    confidence: 51,
    explanation:
      'Não foi possível confirmar ou refutar essa afirmação com alta confiança. As fontes consultadas apresentam informações inconclusivas ou contraditórias. Recomenda-se verificar em fontes primárias.',
    sources: ['Fact-Check API', 'ML Fallback'],
  }
}

export function useFakeChecker() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const check = useCallback(async (statement) => {
    setMessages((prev) => [...prev, { role: 'user', text: statement }])
    setLoading(true)

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600))

    let result
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement }),
      })
      if (res.ok) {
        const data = await res.json()
        result = {
          verdict:     data.verdict     || 'unverified',
          confidence:  Math.round((data.confidence || 0.5) * 100),
          explanation: data.explanation || 'Resultado retornado pela API.',
          sources:     data.sources     || ['Fact-Check API'],
        }
      } else {
        result = getMockResponse(statement)
      }
    } catch {
      result = getMockResponse(statement)
    }

    setMessages((prev) => [
      ...prev,
      { role: 'bot', statement, result },
    ])
    setLoading(false)
  }, [])

  return { messages, loading, check }
}