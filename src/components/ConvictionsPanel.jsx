import React, { useState } from 'react'
import { PICKS_2024, PICKS_2026, CATEGORIES } from '../lib/stockData.js'
import { useTheme } from '../lib/theme.jsx'

// ── Status config — uses CSS variables so dark/light both work ───────────────
const STATUS_META = {
  IN:    { label: 'IN',    bgVar: 'var(--status-in)',    textVar: 'var(--status-in-text)',    dotVar: 'var(--status-in)' },
  OUT:   { label: 'OUT',   bgVar: 'var(--status-out)',   textVar: 'var(--status-out-text)',   dotVar: 'var(--status-out)' },
  WATCH: { label: 'WATCH', bgVar: 'var(--status-watch)', textVar: 'var(--status-watch-text)', dotVar: 'var(--status-watch)' },
}

// ── Conviction bar ────────────────────────────────────────────────────────────
function ConvictionBar({ value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[2px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-3 rounded-sm transition-opacity"
            style={{
              background: i < value ? color : 'var(--border-dim)',
              opacity: i < value ? 1 : 0.35,
            }}
          />
        ))}
      </div>
      <span className="text-xs t-muted font-mono">{value}/10</span>
    </div>
  )
}

// ── Single conviction row ─────────────────────────────────────────────────────
function ConvictionRow({ stock, era, onTickerClick }) {
  const [open, setOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const sm = STATUS_META[stock.status] || STATUS_META.WATCH
  const cat = CATEGORIES[stock.category]
  const catColor = isDark ? (cat?.color || '#888') : (cat?.lightColor || '#555')

  const posType = stock.positionType
  const isPut  = posType === 'PUT'
  const isCall = posType === 'CALL'
  const posColor = isPut ? '#ff6666' : isCall ? '#00ff88' : catColor

  return (
    <div className="border-b t-border-dim">
      {/* ── Collapsed header ─────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-3 py-2.5 flex items-center gap-2 t-hover transition-colors text-left"
      >
        {/* 13F rank (2026 only) */}
        {era === '2026' && stock.rank13F && (
          <span className="shrink-0 text-[10px] font-mono t-faint w-5 text-right">
            #{stock.rank13F}
          </span>
        )}

        {/* Status badge */}
        <span
          className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 tracking-widest"
          style={{ minWidth: 36, textAlign: 'center', background: sm.bgVar, color: sm.textVar }}
        >
          {sm.label}
        </span>

        {/* Position type badge (2026 only) */}
        {era === '2026' && posType && (
          <span
            className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 border tracking-widest"
            style={{
              color: isPut ? 'var(--status-put)' : isCall ? 'var(--status-call)' : catColor,
              borderColor: isPut ? 'var(--status-put)' : isCall ? 'var(--status-call)' : catColor,
              background: isPut ? 'color-mix(in srgb, var(--status-put) 12%, transparent)'
                        : isCall ? 'color-mix(in srgb, var(--status-call) 12%, transparent)'
                        : `${catColor}15`,
            }}
          >
            {posType}
          </span>
        )}

        {/* Ticker */}
        <span className="font-bold text-sm tracking-widest shrink-0" style={{ color: catColor }}>
          {stock.ticker}
        </span>

        {/* Name */}
        <span className="text-xs t-muted truncate flex-1">{stock.name}</span>

        {/* Reported value (2026 only) */}
        {era === '2026' && stock.reportedValue && (
          <span className="text-xs font-mono shrink-0 hidden md:block"
            style={{ color: isPut ? 'var(--status-put)' : 'var(--status-watch)' }}>
            {stock.reportedValue}
          </span>
        )}

        {/* Conviction bar */}
        <div className="hidden sm:block shrink-0">
          <ConvictionBar value={stock.conviction} color={catColor} />
        </div>

        <span className="text-xs t-faint shrink-0">{open ? '▲' : '▼'}</span>
      </button>

      {/* ── Expanded details ──────────────────────────────── */}
      {open && (
        <div className="px-3 pb-4 pt-1 space-y-3 t-bg-panel border-t t-border-dim">

          {/* Mobile conviction bar */}
          <div className="sm:hidden">
            <ConvictionBar value={stock.conviction} color={catColor} />
          </div>

          {/* Signal */}
          <div className="flex gap-2">
            <span
              className="shrink-0 mt-0.5 w-2 h-2 rounded-full"
              style={{ background: sm.dotVar, boxShadow: `0 0 6px var(--status-in-glow)` }}
            />
            <p className="text-xs t-text leading-relaxed font-semibold">{stock.signal}</p>
          </div>

          {/* Fund note (2026 only) */}
          {stock.fundNote && (
            <div className="text-[10px] font-bold border px-2 py-1 tracking-wide"
              style={{ borderColor: 'var(--status-fund-badge)', color: 'var(--status-fund-badge)', background: 'color-mix(in srgb, var(--status-fund-badge) 10%, transparent)' }}>
              {stock.fundNote}
            </div>
          )}

          {/* Thesis */}
          <p className="text-xs t-muted leading-relaxed">{stock.thesis}</p>

          {/* Risk */}
          <div className="border t-border-dim px-3 py-2">
            <div className="text-xs font-bold tracking-wider text-[#ff6666] mb-1">▲ BEAR CASE</div>
            <p className="text-xs t-muted leading-relaxed">{stock.risk}</p>
          </div>

          {/* Catalysts */}
          {stock.catalysts?.length > 0 && (
            <div>
              <div className="text-xs font-bold tracking-wider t-muted mb-1.5">UPCOMING CATALYSTS</div>
              <div className="flex flex-wrap gap-1.5">
                {stock.catalysts.map(c => (
                  <span
                    key={c}
                    className="text-xs border px-2 py-0.5 t-muted"
                    style={{ borderColor: `${catColor}55` }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quote */}
          <blockquote className="border-l-2 pl-2 text-xs italic t-faint" style={{ borderColor: catColor }}>
            {stock.quote}
          </blockquote>

          {/* Jump to investing */}
          <button
            onClick={() => onTickerClick?.(stock.ticker)}
            className="text-xs border t-border px-2.5 py-1 t-muted t-hover transition-colors tracking-wider"
          >
            → chart &amp; thesis
          </button>
        </div>
      )}
    </div>
  )
}

// ── Summary header ────────────────────────────────────────────────────────────
function SummaryBar({ picks, era }) {
  const counts = picks.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {})
  const avgConviction = (picks.reduce((a, s) => a + s.conviction, 0) / picks.length).toFixed(1)

  if (era === '2026') {
    const longs  = picks.filter(s => s.positionType === 'COMMON' || s.positionType === 'LONG + OPTIONS')
    const calls  = picks.filter(s => s.positionType === 'CALL')
    const puts   = picks.filter(s => s.positionType === 'PUT')
    return (
      <div className="px-3 py-2.5 border-b t-border-dim flex items-center gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold px-1.5 py-0.5 text-[10px]"
            style={{ background: 'var(--compute-color)', color: '#000' }}>LONG</span>
          <span className="font-bold t-accent">{longs.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold px-1.5 py-0.5 text-[10px]"
            style={{ background: 'var(--status-call)', color: 'var(--status-in-text)' }}>CALL</span>
          <span className="font-bold" style={{ color: 'var(--status-call)' }}>{calls.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold px-1.5 py-0.5 text-[10px]"
            style={{ background: 'var(--status-put)', color: 'var(--status-out-text)' }}>PUT</span>
          <span className="font-bold" style={{ color: 'var(--status-put)' }}>{puts.length}</span>
          <span className="t-faint text-[10px]">hedges / shorts</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="t-faint">avg conviction</span>
          <span className="font-bold font-mono t-accent">{avgConviction}/10</span>
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 py-2.5 border-b t-border-dim flex items-center gap-4 flex-wrap">
      <div className="flex gap-2 items-center">
        <span className="text-[10px] font-bold px-1.5 py-0.5"
          style={{ background: 'var(--status-in)', color: 'var(--status-in-text)' }}>IN</span>
        <span className="text-sm font-bold" style={{ color: 'var(--status-in)' }}>{counts.IN || 0}</span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-[10px] font-bold px-1.5 py-0.5"
          style={{ background: 'var(--status-watch)', color: 'var(--status-watch-text)' }}>WATCH</span>
        <span className="text-sm font-bold" style={{ color: 'var(--status-watch)' }}>{counts.WATCH || 0}</span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-[10px] font-bold px-1.5 py-0.5"
          style={{ background: 'var(--status-out)', color: 'var(--status-out-text)' }}>OUT</span>
        <span className="text-sm font-bold" style={{ color: 'var(--status-out)' }}>{counts.OUT || 0}</span>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="text-xs t-faint">avg conviction</span>
        <span className="text-sm font-bold font-mono t-accent">{avgConviction}/10</span>
      </div>
    </div>
  )
}

// ── Main ConvictionsPanel ─────────────────────────────────────────────────────
export default function ConvictionsPanel({ era = '2024', onSwitchToInvest }) {
  const [filter, setFilter] = useState('ALL')   // ALL | IN | WATCH | OUT
  const [sort, setSort]     = useState('conviction') // conviction | ticker | category

  const picks = era === '2026' ? PICKS_2026 : PICKS_2024

  const filtered = picks
    .filter(s => filter === 'ALL' || s.status === filter)
    .sort((a, b) => {
      if (sort === 'conviction') return b.conviction - a.conviction
      if (sort === 'ticker')     return a.ticker.localeCompare(b.ticker)
      if (sort === 'category')   return a.category.localeCompare(b.category)
      return 0
    })

  return (
    <div className="flex flex-col h-full t-bg">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-3 py-3 border-b t-border-dim shrink-0">
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest t-accent">CONVICTION TRACKER</span>
            {era === '2026' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 tracking-wider"
                style={{ background: 'var(--status-fund-badge)', color: 'var(--status-fund-text)' }}>
                13F · FEB 2026
              </span>
            )}
          </div>
          <span className="text-xs t-faint">click row to expand</span>
        </div>
        {era === '2026' ? (
          <blockquote className="text-xs italic t-muted border-l-2 pl-2 leading-snug"
            style={{ borderColor: 'var(--status-watch)' }}>
            "The real bottlenecks in the AI boom will be electricity generation and computing capacity."
            <span className="not-italic t-faint ml-1">— Fortune, Feb 2026</span>
          </blockquote>
        ) : (
          <blockquote className="text-xs italic t-muted border-l-2 border-[var(--accent-faint)] pl-2 leading-snug">
            "Those with situational awareness bought much lower than you, but it's still not even close to fully priced in."
          </blockquote>
        )}
      </div>

      {/* ── Summary counts ─────────────────────────────────── */}
      <SummaryBar picks={picks} era={era} />

      {/* ── Filter + sort bar ──────────────────────────────── */}
      <div className="px-3 py-2 border-b t-border-dim flex items-center gap-2 flex-wrap shrink-0">
        <div className="flex gap-1">
          {['ALL', 'IN', 'WATCH', 'OUT'].map(f => {
            const isActive = filter === f
            const activeStyle = isActive ? {
              background: f === 'IN'    ? 'var(--status-in)'
                        : f === 'WATCH' ? 'var(--status-watch)'
                        : f === 'OUT'   ? 'var(--status-out)'
                        : 'var(--accent)',
              color: f === 'OUT' ? 'var(--status-out-text)'
                   : f === 'IN'  ? 'var(--status-in-text)'
                   : f === 'WATCH' ? 'var(--status-watch-text)'
                   : 'var(--bg)',
              borderColor: f === 'IN'    ? 'var(--status-in)'
                         : f === 'WATCH' ? 'var(--status-watch)'
                         : f === 'OUT'   ? 'var(--status-out)'
                         : 'var(--accent)',
            } : {}
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-2 py-0.5 border font-semibold tracking-widest transition-colors ${
                  isActive ? '' : 't-faint t-border-dim t-hover'
                }`}
                style={activeStyle}
              >
                {f}
              </button>
            )
          })}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs t-faint">sort:</span>
          {['conviction', 'ticker', 'category'].map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`text-xs px-2 py-0.5 border transition-colors ${
                sort === s ? 't-text border-[var(--border)]' : 't-faint t-border-dim t-hover'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Rows ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs t-faint">No picks match filter.</div>
        )}
        {filtered.map(stock => (
          <ConvictionRow
            key={stock.ticker}
            stock={stock}
            era={era}
            onTickerClick={() => onSwitchToInvest?.()}
          />
        ))}
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="px-3 py-2 border-t t-border-dim text-xs t-faint shrink-0">
        {era === '2026'
          ? 'Source: Situational Awareness LP 13F, Feb 2026 · Fortune profile · Not financial advice.'
          : 'Based on "Situational Awareness" essay (2024) · Not financial advice.'}
      </div>
    </div>
  )
}
