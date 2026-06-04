import React, { useEffect, useRef, useState } from 'react'
import ChatMessage from './components/ChatMessage'
import TypingIndicator from './components/TypingIndicator'
import WelcomeScreen from './components/WelcomeScreen'
import ChatInput from './components/ChatInput'
import { useFakeChecker } from './hooks/useFakeChecker'
import styles from './App.module.css'

export default function App() {
  const { messages, loading, check } = useFakeChecker()
  const bottomRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const msgRefs = useRef({})

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Pares de conversa: cada pergunta + sua resposta bot correspondente
  const pairs = []
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === 'user') {
      const bot = messages[i + 1]?.role === 'bot' ? messages[i + 1] : null
      pairs.push({ userIndex: i, botIndex: bot ? i + 1 : null, text: messages[i].text })
    }
  }

  const scrollToMessage = (index) => {
    msgRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setSidebarOpen(false)
  }

  return (
    <div className={styles.app}>

      {/* ── Overlay para fechar ao clicar fora ── */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar esquerda ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Histórico</span>
          <button className={styles.toggleBtn} onClick={() => setSidebarOpen(false)} title="Fechar">✕</button>
        </div>

        <div className={styles.historyList}>
          {pairs.length === 0 ? (
            <p className={styles.emptyHint}>Nenhuma consulta ainda.</p>
          ) : (
            pairs.map((pair, i) => (
              <button
                key={i}
                className={styles.historyItem}
                onClick={() => scrollToMessage(pair.userIndex)}
                title={pair.text}
              >
                <span className={styles.historyText}>{pair.text}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ── Botão para reabrir ── */}
      {!sidebarOpen && (
        <button className={styles.openBtn} onClick={() => setSidebarOpen(true)} title="Abrir histórico">
          ☰
        </button>
      )}

      {/* ── Área principal ── */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.topbarTitle}>Verificador de Fake News</span>
          <span className={`${styles.badgeLive} ${styles.topbarRight}`}>API online</span>
        </header>

        <div className={styles.messages}>
          {messages.length === 0 && !loading ? (
            <WelcomeScreen onSuggestion={check} />
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} ref={(el) => (msgRefs.current[i] = el)}>
                  <ChatMessage message={msg} />
                </div>
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <ChatInput onSend={check} disabled={loading} />
      </div>
    </div>
  )
}
