import React, { useEffect, useMemo, useRef, useState } from 'react'

function kindClass(kind) {
  switch (kind) {
    case 'system':
      return 'text-[rgba(0,255,136,0.95)]'
    case 'error':
      return 'text-[rgba(255,80,80,0.95)]'
    case 'input':
      return 'text-[rgba(0,255,136,0.85)]'
    default:
      return 'text-[rgba(0,255,136,0.75)]'
  }
}

export default function Terminal({ lines, onCommand, onClear }) {
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const prompt = useMemo(() => '> ', [])

  useEffect(() => {
    // Auto-scroll
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    // Autofocus terminal input
    inputRef.current?.focus()
  }, [])

  function submit(cmd) {
    const trimmed = cmd.trim()
    if (!trimmed) return

    setHistory((prev) => {
      const next = [...prev]
      // avoid duplicate consecutive
      if (next[next.length - 1] !== trimmed) next.push(trimmed)
      return next
    })
    setHistoryIndex(-1)
    setValue('')
    onCommand(trimmed)
  }

  function onKeyDown(e) {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      onClear?.()
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      submit(value)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setValue(history[nextIndex] ?? '')
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!history.length) return
      if (historyIndex === -1) return
      const nextIndex = Math.min(history.length - 1, historyIndex + 1)
      if (nextIndex === history.length - 1 && historyIndex === history.length - 1) {
        setHistoryIndex(-1)
        setValue('')
        return
      }
      setHistoryIndex(nextIndex)
      setValue(history[nextIndex] ?? '')
    }
  }

  return (
    <div
      className="h-[420px] md:h-[520px] flex flex-col"
      onMouseDown={() => inputRef.current?.focus()}
    >
      <div className="px-4 py-3 border-b border-[rgba(0,255,136,0.25)] text-xs opacity-80">
        TERMINAL · <span className="opacity-90">Ctrl+L</span> clear · ↑/↓ history
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto px-4 py-3 text-sm leading-relaxed"
      >
        {lines.map((l, idx) => (
          <div key={idx} className={kindClass(l.kind)}>
            {l.text}
          </div>
        ))}

        {/* Input row */}
        <div className="mt-2 flex items-center gap-2">
          <span className="opacity-90">{prompt}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none text-[rgba(0,255,136,0.95)] placeholder:text-[rgba(0,255,136,0.35)]"
            placeholder="type a command…"
            spellCheck={false}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
          />
          <span className="cursor" />
        </div>
      </div>
    </div>
  )
}
