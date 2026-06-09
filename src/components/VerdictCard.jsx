import styles from './VerdictCard.module.css'

const CONFIG = {
  'Verdadeiro':        { icon: '✓', color: 'true' },
  'Fake News':         { icon: '✕', color: 'fake' },
}
const { icon, color } = CONFIG[verdict] || { icon: '?', color: 'unverified' }

export default function VerdictCard({ statement, result }) {
  const { verdict, confidence, explanation, sources } = result
  const { icon, label } = CONFIG[verdict] || CONFIG.unverified
  const isML = sources.includes('ML Model')
  const showConfidence = isML && confidence > 75

  return (
    <div className={styles.wrapper}>
      <p className={styles.intro}>
        Análise para: <em className={styles.statement}>"{statement}"</em>
      </p>
      <div className={styles.card}>
        <div className={`${styles.header} ${styles[verdict]}`}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
        <div className={styles.body}>
          <p>{explanation}</p>
          <div className={styles.barTrack}>
            <div
              className={`${styles.barFill} ${styles[verdict]}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          {showConfidence && (
            <div className={styles.confLabel}>
              <span>confiança</span>
              <span className={styles.confValue}>{confidence}%</span>
            </div>
          )}
          <div className={styles.sources}>
            {sources.map((s) => (
              <span key={s} className={styles.tag}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
