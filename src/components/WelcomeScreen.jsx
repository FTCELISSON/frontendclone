import React from 'react'
import styles from './WelcomeScreen.module.css'

const SUGGESTIONS = [
  'Vacinas de COVID causam infertilidade',
  'O Brasil é o maior exportador de soja do mundo',
  '5G é responsável pela proliferação do coronavírus',
]

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    width="28" height="28">
    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

export default function WelcomeScreen({ onSuggestion }) {
  return (
    <div className={styles.welcome}>
      <div className={styles.icon}><ShieldIcon /></div>
      <h2 className={styles.title}>Verificação de Fake News</h2>
      <p className={styles.desc}>
        Envie qualquer afirmação, notícia ou texto. A IA vai analisar,
        cruzar fontes e retornar um veredito fundamentado.
      </p>
      <div className={styles.suggestions}>
        {SUGGESTIONS.map((s) => (
          <button key={s} className={styles.chip} onClick={() => onSuggestion(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
