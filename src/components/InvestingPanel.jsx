import React, { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { STOCK_PICKS, PICKS_2024, PICKS_2026, CATEGORIES } from '../lib/stockData.js'
import { CHAPTERS } from '../lib/graphData.js'
import { useTheme } from '../lib/theme.jsx'

// ── Yahoo Finance proxy (no API key needed) ──────────────────────────────────
async function fetchYahooChart(ticker) {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1y&interval=1d&includePrePost=false`
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooUrl)}`
  const res = await fetch(proxyUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const wrapper = await res.json()
  const json    = JSON.parse(wrapper.contents)
  const result  = json.chart?.result?.[0]
  if (!result) throw new Error('no result')
  const timestamps = result.timestamp
  const closes     = result.indicators.quote[0].close
  const meta       = result.meta
  return {
    price:    meta.regularMarketPrice,
    change:   ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose * 100),
    prevClose: meta.chartPreviousClose,
    currency: meta.currency,
    history:  timestamps.map((ts, i) => ({
      date:  new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      close: closes[i] != null ? +closes[i].toFixed(2) : null,
    })).filter(d => d.close != null),
  }
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, color }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="border px-2 py-1 text-xs t-bg" style={{ borderColor: `${color}66`, color }}>
      <div className="opacity-70">{d.date}</div>
      <div className="font-bold">${d.close.toFixed(2)}</div>
    </div>
  )
}

// ── Single stock card ────────────────────────────────────────────────────────
function StockCard({ stock, onNodeFocus }) {
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [err, setErr]           = useState(null)
  const [expanded, setExpanded] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    setLoading(true); setErr(null)
    fetchYahooChart(stock.ticker)
      .then(d  => { setData(d); setLoading(false) })
      .catch(e => { setErr(e.message); setLoading(false) })
  }, [stock.ticker])

  const isUp = data?.change >= 0
  const cat  = CATEGORIES[stock.category]
  const col  = isDark ? stock.color : (cat?.lightColor || stock.color)
  const ch   = CHAPTERS[stock.chapterRef]

  const minClose = data ? Math.min(...data.history.map(d => d.close)) : 0
  const maxClose = data ? Math.max(...data.history.map(d => d.close)) : 0
  const yDomain  = [minClose * 0.97, maxClose * 1.03]

  return (
    <div
      className="transition-colors t-bg"
      style={{ borderBottom: `1px solid var(--border-dim)` }}
    >
      {/* ── Header row ──────────────────────────────────────────────────── */}
      <div
        className="px-3 py-2 flex items-center gap-2 cursor-pointer select-none hover:bg-[rgba(255,255,255,0.03)]"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Ticker + name */}
        <div className="flex items-baseline gap-2 flex-1 min-w-0">
          <span className="font-bold text-sm tracking-widest shrink-0" style={{ color: col }}>
            {stock.ticker}
          </span>
          <span className="text-xs t-muted truncate">{stock.name}</span>        </div>

        {/* Price info */}
        <div className="flex items-center gap-2.5 shrink-0">
          {loading && <span className="text-xs t-faint">loading…</span>}
          {err     && <span className="text-xs" style={{ color: 'var(--error)' }}>offline</span>}
          {data && (
            <>
              <span className="text-sm font-mono font-bold" style={{ color: col }}>
                ${data.price < 10 ? data.price.toFixed(3) : data.price.toFixed(2)}
              </span>
              <span className={`text-xs font-mono font-semibold`}
                style={{ color: isUp ? 'var(--status-in)' : 'var(--status-out)' }}>
                {isUp ? '▲' : '▼'}{Math.abs(data.change).toFixed(2)}%
              </span>
            </>
          )}
          <span className="text-xs t-muted">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* ── Sparkline — always visible ───────────────────────────────────── */}
      {data && (
        <div className="px-2 pb-1" style={{ height: 56 }}>
          <ResponsiveContainer width="100%" height={56}>
            <AreaChart data={data.history} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
              <defs>
                <linearGradient id={`grad-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={col} stopOpacity={0.40} />
                  <stop offset="100%" stopColor={col} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <YAxis domain={yDomain} hide />
              <XAxis dataKey="date" hide />
              <Tooltip content={<ChartTooltip color={col} />} />
              <Area
                type="monotone" dataKey="close"
                stroke={col} strokeWidth={2}
                fill={`url(#grad-${stock.ticker})`}
                dot={false} activeDot={{ r: 4, fill: col, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      {!data && !loading && (
        <div className="px-3 pb-2 text-xs text-[rgba(255,255,255,0.30)]">chart unavailable</div>
      )}

      {/* ── Expanded thesis ───────────────────────────────────────────────── */}
      {expanded && (
        <div className="px-3 pb-4 pt-2 space-y-3 border-t" style={{ borderColor: `${col}22` }}>

          {/* Quote callout */}
          <blockquote
            className="border-l-2 pl-3 text-xs leading-relaxed italic t-text"
            style={{ borderColor: col }}
          >
            {stock.quote}
          </blockquote>

          {/* Thesis */}
          <p className="text-xs leading-relaxed t-muted">
            {stock.thesis}
          </p>

          {/* Essay chapter link */}
          {ch && (
            <a
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold border px-2.5 py-1 hover:opacity-90 transition-opacity"
              style={{ borderColor: `${col}66`, color: col }}
            >
              {ch.label} ↗
            </a>
          )}

          {/* Graph node buttons */}
          {stock.graphNodes?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs t-faint self-center">→ graph:</span>
              {stock.graphNodes.map(nid => (
                <button
                  key={nid}
                  onClick={() => onNodeFocus?.(nid)}
                  className="text-xs border t-border-dim px-2 py-0.5 t-muted hover:t-text hover:border-[var(--border)] transition-colors"
                >
                  {nid.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Category Section ─────────────────────────────────────────────────────────
function CategorySection({ categoryKey, stocks, onNodeFocus }) {
  const cat = CATEGORIES[categoryKey]
  const [collapsed, setCollapsed] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const catColor = isDark ? cat.color : (cat.lightColor || cat.color)

  return (
    <div>
      {/* Category header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full px-3 py-2 flex items-center gap-2 transition-colors sticky top-0 z-10"
        style={{ backgroundColor: 'var(--bg-panel)', borderBottom: `1px solid ${catColor}44` }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full shrink-0"
          style={{ background: catColor, boxShadow: isDark ? `0 0 6px ${catColor}` : 'none' }}
        />
        <span className="text-xs font-bold tracking-widest" style={{ color: catColor }}>
          {cat.label.toUpperCase()}
        </span>
        <span className="text-xs t-faint ml-auto">
          {stocks.length} picks · {collapsed ? '▼' : '▲'}
        </span>
      </button>

      {/* Stock cards */}
      {!collapsed && stocks.map(stock => (
        <StockCard key={stock.ticker} stock={stock} onNodeFocus={onNodeFocus} />
      ))}
    </div>
  )
}

// ── Main InvestingPanel ───────────────────────────────────────────────────────
export default function InvestingPanel({ era = '2024', onNodeFocus }) {
  const picks = era === '2026' ? PICKS_2026 : PICKS_2024

  // Group picks by category, preserving category order
  const grouped = Object.keys(CATEGORIES).reduce((acc, key) => {
    acc[key] = picks.filter(s => s.category === key)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full t-bg">

      {/* ── Panel header ─────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b t-border-dim shrink-0">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold tracking-widest t-accent">
            AI INFRASTRUCTURE PLAYS
          </span>
          <div className="flex items-center gap-2">
            {era === '2026' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 tracking-wider"
                style={{ background: 'var(--status-fund-badge)', color: 'var(--status-fund-text)' }}>
                13F · FEB 2026
              </span>
            )}
            <span className="text-xs t-muted">1y chart · click card</span>
          </div>
        </div>
        {era === '2026' ? (
          <blockquote className="mt-1.5 text-xs italic t-muted leading-snug border-l-2 pl-2"
            style={{ borderColor: 'var(--status-watch)' }}>
            "The most valuable assets in the AI era may not be algorithms, but electricity and computing power."
            <span className="not-italic t-faint ml-1">— Fortune profile, Feb 2026</span>
          </blockquote>
        ) : (
          <blockquote className="mt-1.5 text-xs italic t-muted leading-snug border-l-2 border-[var(--accent-faint)] pl-2">
            "NVDA/TSM… it's still not even close to fully priced in."
            <span className="not-italic t-faint ml-1">— Aschenbrenner, IIIa fn.26</span>
          </blockquote>
        )}
      </div>

      {/* ── Category groups ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {Object.entries(grouped).map(([key, stocks]) =>
          stocks.length > 0 && (
            <CategorySection
              key={key}
              categoryKey={key}
              stocks={stocks}
              onNodeFocus={onNodeFocus}
            />
          )
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="px-3 py-2 border-t t-border-dim text-xs t-faint leading-tight shrink-0">
        Not financial advice. Thesis extracted from Aschenbrenner (2024). Prices via Yahoo Finance.
      </div>
    </div>
  )
}
