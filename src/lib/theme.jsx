import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// ─── Context ─────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null)

export function useTheme() {
  return useContext(ThemeContext)
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [theme, setTheme]       = useState(() => localStorage.getItem('sa-theme') || 'dark')
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('sa-fontsize') || '14'))
  const [scanlines, setScanlines] = useState(() => localStorage.getItem('sa-scanlines') !== 'false')
  const [curve, setCurve]       = useState(() => localStorage.getItem('sa-curve') !== 'false')
  const [flicker, setFlicker]   = useState(() => localStorage.getItem('sa-flicker') !== 'false')
  const [glow, setGlow]         = useState(() => localStorage.getItem('sa-glow') !== 'false')
  const [settingsOpen, setSettingsOpen] = useState(false)

  // '2024' = essay thesis picks | '2026' = actual 13F fund holdings
  const [era, setEra] = useState(() => localStorage.getItem('sa-era') || '2024')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sa-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    localStorage.setItem('sa-fontsize', fontSize)
  }, [fontSize])

  useEffect(() => { localStorage.setItem('sa-scanlines', scanlines) }, [scanlines])
  useEffect(() => { localStorage.setItem('sa-curve', curve) }, [curve])
  useEffect(() => { localStorage.setItem('sa-flicker', flicker) }, [flicker])
  useEffect(() => { localStorage.setItem('sa-glow', glow) }, [glow])
  useEffect(() => { localStorage.setItem('sa-era', era) }, [era])

  const value = {
    theme, setTheme,
    fontSize, setFontSize,
    scanlines, setScanlines,
    curve, setCurve,
    flicker, setFlicker,
    glow, setGlow,
    settingsOpen, setSettingsOpen,
    era, setEra,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─── Draggable Settings Window ────────────────────────────────────────────────
export function SettingsWindow() {
  const ctx = useTheme()
  if (!ctx.settingsOpen) return null

  const winRef  = useRef(null)
  const dragRef = useRef({ dragging: false, ox: 0, oy: 0 })
  const [pos, setPos] = useState({ x: 80, y: 80 })

  const onMouseDown = useCallback((e) => {
    dragRef.current = { dragging: true, ox: e.clientX - pos.x, oy: e.clientY - pos.y }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [pos])

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current.dragging) return
    setPos({ x: e.clientX - dragRef.current.ox, y: e.clientY - dragRef.current.oy })
  }, [])

  const onMouseUp = useCallback(() => {
    dragRef.current.dragging = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }, [onMouseMove])

  const isDark = ctx.theme === 'dark'

  return (
    <div
      ref={winRef}
      className="settings-window"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* Title bar */}
      <div className="settings-titlebar" onMouseDown={onMouseDown}>
        {/* OS-style traffic lights */}
        <button
          onClick={() => ctx.setSettingsOpen(false)}
          className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors shrink-0"
          title="Close"
        />
        <span className="w-3 h-3 rounded-full bg-[#febc2e] shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#28c840] shrink-0" />
        <span className="flex-1 text-center text-xs font-bold tracking-widest t-muted">
          DISPLAY SETTINGS
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-5">

        {/* Theme */}
        <div>
          <div className="text-xs font-bold tracking-widest t-muted mb-2">THEME</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => ctx.setTheme('dark')}
              className={`px-3 py-2 text-xs font-bold border transition-colors ${
                isDark
                  ? ''
                  : 'border-[var(--border)] t-text t-hover'
              }`}
              style={isDark ? { background: 'var(--status-in)', color: 'var(--status-in-text)', borderColor: 'var(--status-in)' } : {}}
            >
              ◉ TERMINAL
              <div className="text-[10px] font-normal opacity-70 mt-0.5">phosphor green</div>
            </button>
            <button
              onClick={() => ctx.setTheme('light')}
              className={`px-3 py-2 text-xs font-bold border transition-colors ${
                !isDark
                  ? 'bg-[#1a1a1a] text-[#f5f0e8] border-[#1a1a1a]'
                  : 'border-[var(--border)] t-text t-hover'
              }`}
            >
              ◎ PAPER
              <div className="text-[10px] font-normal opacity-70 mt-0.5">newsprint light</div>
            </button>
          </div>
        </div>

        {/* Font size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-widest t-muted">FONT SIZE</span>
            <span className="text-xs t-accent font-mono font-bold">{ctx.fontSize}px</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => ctx.setFontSize(s => Math.max(11, s - 1))}
              className="w-7 h-7 border t-border text-xs t-text t-hover flex items-center justify-center font-bold"
            >−</button>
            <input
              type="range" min="11" max="18" step="1"
              value={ctx.fontSize}
              onChange={e => ctx.setFontSize(+e.target.value)}
              className="flex-1 accent-[var(--accent)] h-1"
            />
            <button
              onClick={() => ctx.setFontSize(s => Math.min(18, s + 1))}
              className="w-7 h-7 border t-border text-xs t-text t-hover flex items-center justify-center font-bold"
            >+</button>
          </div>
          <div className="flex justify-between text-[10px] t-faint mt-1">
            <span>11</span><span>14</span><span>18</span>
          </div>
        </div>

        {/* Visual effects toggles */}
        <div>
          <div className="text-xs font-bold tracking-widest t-muted mb-2">VISUAL EFFECTS</div>
          <div className="space-y-1.5">
            {[
              { label: 'Scanlines',     key: 'scanlines', get: ctx.scanlines, set: ctx.setScanlines },
              { label: 'CRT Flicker',   key: 'flicker',   get: ctx.flicker,   set: ctx.setFlicker   },
              { label: 'Screen Curve',  key: 'curve',     get: ctx.curve,     set: ctx.setCurve     },
              { label: 'Text Glow',     key: 'glow',      get: ctx.glow,      set: ctx.setGlow      },
            ].map(({ label, key, get, set }) => (
              <button
                key={key}
                onClick={() => set(v => !v)}
                className="w-full flex items-center justify-between px-2 py-1.5 border t-border t-hover transition-colors"
              >
                <span className="text-xs t-text">{label}</span>
                <span className={`text-xs font-mono font-bold ${get ? 't-accent' : 't-faint'}`}>
                  {get ? 'ON' : 'OFF'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            ctx.setTheme('dark')
            ctx.setFontSize(14)
            ctx.setScanlines(true)
            ctx.setFlicker(true)
            ctx.setCurve(true)
            ctx.setGlow(true)
          }}
          className="w-full py-1.5 text-xs border t-border t-muted t-hover tracking-widest"
        >
          RESET DEFAULTS
        </button>
      </div>
    </div>
  )
}
