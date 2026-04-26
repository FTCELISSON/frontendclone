import React from 'react'
import VerdictCard from './VerdictCard'
import styles from './ChatMessage.module.css'

export default function ChatMessage({ message }) {
  const { role, text, statement, result } = message
  const isBot = role === 'bot'

  return (
    <div className={`${styles.msg} ${isBot ? styles.bot : styles.user}`}>
      <div className={`${styles.avatar} ${isBot ? styles.avatarBot : styles.avatarUser}`}>
        {isBot ? '✓' : 'EU'}
      </div>
      <div className={`${styles.bubble} ${isBot ? styles.bubbleBot : styles.bubbleUser}`}>
        {isBot
          ? <VerdictCard statement={statement} result={result} />
          : text
        }
      </div>
    </div>
  )
}
