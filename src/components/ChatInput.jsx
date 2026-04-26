import React, { useState, useRef } from 'react'
import styles from './ChatInput.module.css'

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    width="15" height="15">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none" />
  </svg>
)

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  function handleChange(e) {
    setValue(e.target.value)
    const el = textareaRef.current
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 110) + 'px'
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  return (
    <div className={styles.area}>
      <div className={styles.wrap}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma afirmação para verificar..."
          rows={1}
          className={styles.textarea}
        />
      </div>
      <button
        className={styles.btn}
        onClick={submit}
        disabled={disabled || !value.trim()}
        title="Enviar"
      >
        <SendIcon />
      </button>
    </div>
  )
}
