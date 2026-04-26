import React from 'react'
import styles from './TypingIndicator.module.css'

export default function TypingIndicator() {
  return (
    <div className={styles.msg}>
      <div className={styles.avatar}>✓</div>
      <div className={styles.bubble}>
        <div className={styles.typing}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </div>
    </div>
  )
}
