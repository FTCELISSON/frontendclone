import React, { useEffect, useRef } from 'react'
import ChatMessage from './components/ChatMessage'
import TypingIndicator from './components/TypingIndicator'
import WelcomeScreen from './components/WelcomeScreen'
import ChatInput from './components/ChatInput'
import { useFakeChecker } from './hooks/useFakeChecker'
import styles from './App.module.css'

export default function App() {
  const { messages, loading, check } = useFakeChecker()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className={styles.app}>

      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <span className={styles.topbarTitle}>Verificador de Fake News</span>
          <span className={styles.badgeLive}>API online</span>
        </header>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 && !loading ? (
            <WelcomeScreen onSuggestion={check} />
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={check} disabled={loading} />
      </div>
    </div>
  )
}
