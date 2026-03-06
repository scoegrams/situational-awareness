import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Terminal from './components/Terminal.jsx'
import GraphPanel from './components/GraphPanel.jsx'
import NodeInfo from './components/NodeInfo.jsx'
import InvestingPanel from './components/InvestingPanel.jsx'
import ConvictionsPanel from './components/ConvictionsPanel.jsx'
import { graph, CHAPTERS, mapAscii, timelineLines } from './lib/graphData.js'
import { useTheme, SettingsWindow } from './lib/theme.jsx'

function buildAdjacency(g) {
  const adj = new Map()
  for (const n of g.nodes) adj.set(n.id, new Set())
  for (const l of g.links) {
    const a = typeof l.source === 'string' ? l.source : l.source?.id
    const b = typeof l.target === 'string' ? l.target : l.target?.id
    if (!a || !b) continue
    if (!adj.has(a)) adj.set(a, new Set())
    if (!adj.has(b)) adj.set(b, new Set())
    adj.get(a).add(b)
    adj.get(b).add(a)
  }
  return adj
}

function bfsTrace(adj, start, maxDepth = 2) {
  if (!adj.has(start)) return []
  const out = []
  const q = [{ id: start, depth: 0 }]
  const seen = new Set([start])
  while (q.length) {
    const { id, depth } = q.shift()
    const neighbors = [...(adj.get(id) ?? [])]
    out.push({ id, depth, neighbors })
    if (depth >= maxDepth) continue
    for (const nb of neighbors) {
      if (seen.has(nb)) continue
      seen.add(nb)
      q.push({ id: nb, depth: depth + 1 })
    }
  }
  return out
}

function nodeById(id) {
  return graph.nodes.find((n) => n.id === id) || null
}

// ── Drag-resize handle ────────────────────────────────────────────────────────
function ResizeHandle({ onDrag }) {
  const dragging = useRef(false)
  const startX   = useRef(0)

  const onMouseDown = useCallback((e) => {
    dragging.current = true
    startX.current   = e.clientX
    e.preventDefault()

    const onMove = (ev) => {
      if (!dragging.current) return
      onDrag(ev.clientX - startX.current)
      startX.current = ev.clientX
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [onDrag])

  return (
    <div
      onMouseDown={onMouseDown}
      className="hidden md:flex items-center justify-center w-2 shrink-0 cursor-col-resize group select-none z-10"
      title="Drag to resize"
    >
      <div className="w-px h-full t-border group-hover:bg-[var(--accent)] transition-colors" />
    </div>
  )
}

// ── Default column widths (px, computed from % of ~1200px viewport) ───────────
const DEFAULT_COLS = { left: 420, mid: 280, right: 380 }

export default function App() {
  const { theme, scanlines, curve, flicker, glow, setSettingsOpen, era, setEra } = useTheme()

  const [lines, setLines]           = useState([])
  const [booted, setBooted]         = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [rightTab, setRightTab]     = useState('graph')

  // Resizable column widths
  const [cols, setCols] = useState(() => {
    try {
      const saved = localStorage.getItem('sa-cols')
      return saved ? JSON.parse(saved) : DEFAULT_COLS
    } catch { return DEFAULT_COLS }
  })

  const saveCols = useCallback((next) => {
    setCols(next)
    localStorage.setItem('sa-cols', JSON.stringify(next))
  }, [])

  const resizeLeft = useCallback((dx) => {
    saveCols(prev => ({
      ...prev,
      left: Math.max(240, Math.min(700, prev.left + dx)),
    }))
  }, [saveCols])

  const resizeMid = useCallback((dx) => {
    saveCols(prev => ({
      ...prev,
      mid: Math.max(200, Math.min(600, prev.mid + dx)),
    }))
  }, [saveCols])

  const adj = useMemo(() => buildAdjacency(graph), [])
  const selectedNode  = useMemo(() => nodeById(selectedId), [selectedId])
  const neighborSet   = useMemo(() => {
    if (!selectedId) return new Set()
    return new Set([selectedId, ...(adj.get(selectedId) ?? [])])
  }, [adj, selectedId])
  const neighborNodes = useMemo(() => {
    if (!selectedId) return []
    return [...(adj.get(selectedId) ?? [])].map(nodeById).filter(Boolean)
  }, [adj, selectedId])

  const bootTimersRef = useRef([])

  function addLine(text, kind = 'output') { setLines(p => [...p, { kind, text }]) }
  function addLines(arr) { setLines(p => [...p, ...arr]) }
  function clearTerminal() { setLines([]) }

  function openNode(id) {
    const node = nodeById(id)
    if (!node) {
      addLine(`ERROR: node not found → "${id}"`, 'error')
      addLine('Try: nodes  (list all node IDs)', 'output')
      return
    }
    setSelectedId(id)
    const ch = CHAPTERS[node.chapter]
    addLines([
      { kind: 'system', text: `▶ ${node.title}` },
      { kind: 'dim',    text: `id: ${node.id}  |  chapter: ${ch?.label ?? node.chapter ?? '—'}` },
      { kind: 'output', text: node.summary },
    ])
    const neighbors = [...(adj.get(id) ?? [])]
    if (neighbors.length) addLine('links: ' + neighbors.map(nid => nodeById(nid)?.title ?? nid).join(' · '), 'dim')
  }

  function cmdHelp() {
    addLines([
      { kind: 'system',  text: '── COMMANDS ───────────────────────────────────────' },
      { kind: 'section', text: 'NAVIGATION' },
      { kind: 'output',  text: '  nodes              list all concept nodes' },
      { kind: 'output',  text: '  open <id>          open a node (e.g. open agi_by_2027)' },
      { kind: 'output',  text: '  trace <id>         show 2-hop connection graph' },
      { kind: 'section', text: 'SEARCH' },
      { kind: 'output',  text: '  search <query>     search nodes by title/summary/keyword' },
      { kind: 'section', text: 'OVERVIEW' },
      { kind: 'output',  text: '  chapters           list the 7 essay chapters' },
      { kind: 'output',  text: '  timeline           AGI capability timeline (2019–2030)' },
      { kind: 'output',  text: '  map                topology diagram' },
      { kind: 'section', text: 'UTILITY' },
      { kind: 'output',  text: '  clear  (Ctrl+L)    clear terminal' },
      { kind: 'output',  text: '  help               show this message' },
      { kind: 'dim',     text: '────────────────────────────────────────────────────' },
    ])
  }

  function cmdNodes() {
    const byChapter = {}
    for (const n of graph.nodes) {
      if (!byChapter[n.chapter]) byChapter[n.chapter] = []
      byChapter[n.chapter].push(n)
    }
    addLine(`${graph.nodes.length} nodes  ·  ${graph.links.length} edges`, 'system')
    for (const [ch, nodes] of Object.entries(byChapter)) {
      addLine(`  ${CHAPTERS[ch]?.label ?? ch ?? '—'}`, 'section')
      for (const n of nodes) addLine(`    ${n.id.padEnd(28)} ${n.title}`, 'output')
    }
  }

  function cmdChapters() {
    addLine('ESSAY CHAPTERS — situational-awareness.ai', 'system')
    for (const [key, ch] of Object.entries(CHAPTERS)) {
      addLine(`  ${key.padEnd(5)} ${ch.label}`, 'output')
      addLine(`        ${ch.url}`, 'dim')
    }
  }

  function cmdMap() {
    addLine('TOPOLOGY MAP:', 'system')
    mapAscii.trimEnd().split('\n').forEach(ln => addLine(ln, 'output'))
  }

  function cmdTimeline() {
    addLine('CAPABILITY TIMELINE:', 'system')
    timelineLines.forEach(ln => addLine(ln, 'output'))
  }

  function cmdSearch(query) {
    if (!query) { addLine('USAGE: search <query>', 'error'); return }
    const q = query.toLowerCase()
    const matches = graph.nodes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.id.toLowerCase().includes(q) ||
      n.keywords?.some(kw => kw.toLowerCase().includes(q))
    )
    if (!matches.length) { addLine(`No matches for "${query}"`, 'error'); return }
    addLine(`${matches.length} result${matches.length > 1 ? 's' : ''} for "${query}":`, 'system')
    for (const m of matches) {
      addLine(`  ${m.id.padEnd(28)} ${m.title}`, 'output')
      addLine(`    ${m.summary.slice(0, 90)}${m.summary.length > 90 ? '…' : ''}`, 'dim')
    }
  }

  function cmdTrace(id) {
    if (!id) { addLine('USAGE: trace <id>', 'error'); return }
    if (!adj.has(id)) { addLine(`ERROR: node not found → "${id}"`, 'error'); return }
    addLine(`TRACE: ${nodeById(id)?.title ?? id}  (depth=2)`, 'system')
    const rows = bfsTrace(adj, id, 2)
    for (const r of rows) {
      const indent = '  '.repeat(r.depth)
      const title = nodeById(r.id)?.title ?? r.id
      const nts = r.neighbors.map(nid => nodeById(nid)?.title ?? nid).join(', ')
      addLine(`${indent}${title} → ${nts || '(none)'}`, r.depth === 0 ? 'section' : 'output')
    }
  }

  function onCommand(raw) {
    const cmd = raw.trim()
    if (!cmd) return
    addLine(`> ${cmd}`, 'input')
    const [head, ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ')
    switch (head.toLowerCase()) {
      case 'help':     cmdHelp();       break
      case 'clear':    clearTerminal(); break
      case 'map':      cmdMap();        break
      case 'nodes':    cmdNodes();      break
      case 'chapters': cmdChapters();   break
      case 'search':   cmdSearch(arg);  break
      case 'timeline': cmdTimeline();   break
      case 'open':
        if (!arg) { addLine('USAGE: open <id>', 'error'); break }
        openNode(arg); break
      case 'trace':    cmdTrace(arg);   break
      default:
        addLine(`unknown command: "${head}"`, 'error')
        addLine('Type help for a list of commands.', 'dim')
    }
  }

  function boot() {
    bootTimersRef.current.forEach(t => clearTimeout(t))
    bootTimersRef.current = []
    const bootLines = [
      { kind: 'system',  text: 'SITUATIONAL AWARENESS TERMINAL' },
      { kind: 'dim',     text: 'Based on Aschenbrenner (2024) · situational-awareness.ai' },
      { kind: 'dim',     text: '─────────────────────────────────────────────' },
      { kind: 'output',  text: `${graph.nodes.length} concept nodes  ·  ${graph.links.length} edges  ·  7 chapters` },
      { kind: 'dim',     text: '─────────────────────────────────────────────' },
      { kind: 'section', text: 'Quick start:' },
      { kind: 'output',  text: '  chapters          see all 7 essay chapters' },
      { kind: 'output',  text: '  open agi_by_2027  open a specific node' },
      { kind: 'output',  text: '  search alignment  keyword search' },
      { kind: 'output',  text: '  timeline          AGI capability timeline' },
      { kind: 'output',  text: '  help              all commands' },
      { kind: 'system',  text: 'READY' },
    ]
    setLines([])
    setBooted(false)
    bootLines.forEach((l, idx) => {
      const t = setTimeout(() => {
        setLines(p => [...p, l])
        if (idx === bootLines.length - 1) setBooted(true)
      }, 200 + idx * 120)
      bootTimersRef.current.push(t)
    })
  }

  useEffect(() => {
    boot()
    return () => { bootTimersRef.current.forEach(t => clearTimeout(t)) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rootCls = [
    'min-h-screen t-bg',
    scanlines ? 'scanlines' : '',
    flicker   ? 'flicker'   : '',
  ].filter(Boolean).join(' ')

  const innerCls = [
    'mx-auto max-w-[1800px] p-3 md:p-4',
    glow   ? 'crt-glow' : '',
    curve  ? 'curve'    : '',
  ].filter(Boolean).join(' ')

  const TABS = [
    { id: 'graph',    label: 'GRAPH' },
    { id: 'invest',   label: 'INVESTING' },
    { id: 'convict',  label: 'CONVICTIONS' },
  ]

  return (
    <>
      <div className={rootCls}>
        <div className={innerCls}>

          {/* ── Header ──────────────────────────────────────────────── */}
          <header className="mb-3 flex items-center justify-between border t-border px-4 py-2 gap-3 flex-wrap">
            {/* Left: title */}
            <div className="flex items-baseline gap-3 min-w-0">
              <span className="text-base font-bold tracking-wide t-accent whitespace-nowrap">
                SITUATIONAL AWARENESS
              </span>
              <a
                href="https://situational-awareness.ai/"
                target="_blank" rel="noopener noreferrer"
                className="hidden md:inline text-xs t-faint hover:t-muted transition-colors tracking-wider whitespace-nowrap"
              >
                situational-awareness.ai ↗
              </a>
            </div>

            {/* Center: ERA TOGGLE — the main mode switch */}
            <div className="flex items-center gap-0 border t-border overflow-hidden shrink-0">
              <button
                onClick={() => setEra('2024')}
                className={`px-3 py-1.5 text-xs font-bold tracking-widest transition-colors ${
                  era === '2024'
                    ? 'bg-[var(--accent)] text-black'
                    : 't-faint hover:t-muted'
                }`}
                title="Essay thesis picks — Aschenbrenner (2024)"
              >
                2024 ESSAY
              </button>
              <div className="w-px h-full t-border self-stretch" />
              <button
                onClick={() => setEra('2026')}
                className={`px-3 py-1.5 text-xs font-bold tracking-widest transition-colors relative ${
                  era === '2026' ? '' : 't-faint hover:t-muted'
                }`}
                style={era === '2026' ? {
                  background: 'var(--era-fund-color)',
                  color: 'var(--status-fund-text)',
                } : {}}
                title="Actual 13F fund holdings — Situational Awareness LP (Feb 2026)"
              >
                MAR 2026 FUND
                {era === '2026' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                    style={{ background: 'var(--status-in)' }} />
                )}
              </button>
            </div>

            {/* Right: status + controls */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs t-accent font-semibold">
                {booted ? '● READY' : '○ BOOTING'}
              </span>
              <button
                onClick={() => saveCols(DEFAULT_COLS)}
                className="text-xs border t-border t-faint hover:t-muted px-2 py-1 transition-colors"
                title="Reset panel widths"
              >
                ⊟
              </button>
              <button
                onClick={() => setSettingsOpen(v => !v)}
                className="text-xs border t-border t-muted hover:t-text transition-colors px-2.5 py-1 font-mono tracking-wider"
                title="Display settings"
              >
                ⚙ {theme === 'dark' ? 'TERMINAL' : 'PAPER'}
              </button>
            </div>
          </header>

          {/* ── Main resizable layout ────────────────────────────────── */}
          <main className="flex gap-0 border t-border overflow-hidden" style={{ minHeight: 580 }}>

            {/* ── Left: Terminal ─────────────────────────── */}
            <section
              className="shrink-0 overflow-hidden flex flex-col border-r t-border"
              style={{ width: cols.left }}
            >
              <Terminal lines={lines} onCommand={onCommand} onClear={clearTerminal} />
            </section>

            <ResizeHandle onDrag={resizeLeft} />

            {/* ── Mid: Node Details ──────────────────────── */}
            <section
              className="shrink-0 overflow-hidden flex flex-col border-r t-border"
              style={{ width: cols.mid }}
            >
              <div className="px-3 py-2 border-b t-border-dim text-xs tracking-widest t-muted font-semibold shrink-0">
                NODE DETAILS
              </div>
              <div className="flex-1 overflow-auto px-3 py-3">
                <NodeInfo node={selectedNode} neighborNodes={neighborNodes} onOpen={openNode} />
              </div>
            </section>

            <ResizeHandle onDrag={resizeMid} />

            {/* ── Right: tabbed ──────────────────────────── */}
            <section className="flex-1 min-w-0 overflow-hidden flex flex-col">
              {/* Tab bar */}
              <div className="flex border-b t-border-dim shrink-0">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id)}
                    className={`px-3 py-2 text-xs tracking-widest font-semibold transition-colors whitespace-nowrap ${
                      rightTab === tab.id
                        ? 't-accent border-b-2 border-[var(--accent)]'
                        : 't-faint hover:t-muted'
                    }`}
                  >
                    {tab.label}
                    {tab.id === 'convict' && (
                      <span className="ml-1.5 text-[9px] px-1 rounded-sm font-bold"
                        style={{ background: 'var(--status-in)', color: 'var(--status-in-text)' }}>
                        {/* IN count badge */}
                        {/* We'll just show a dot instead to avoid import */}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-hidden">
                {rightTab === 'graph' && (
                  <GraphPanel
                    graph={graph}
                    selectedId={selectedId}
                    neighborSet={neighborSet}
                    onSelect={id => openNode(id)}
                  />
                )}
                {rightTab === 'invest' && (
                  <InvestingPanel era={era} onNodeFocus={id => { openNode(id); setRightTab('graph') }} />
                )}
                {rightTab === 'convict' && (
                  <ConvictionsPanel era={era} onSwitchToInvest={() => setRightTab('invest')} />
                )}
              </div>
            </section>
          </main>

          {/* ── Footer ─────────────────────────────────────────────── */}
          <footer className="mt-2 flex items-center justify-between text-xs t-muted">
            <span>
              drag <span className="t-faint">│</span> handles to resize panels ·{' '}
              click nodes in graph · type{' '}
              <span className="t-accent">search &lt;keyword&gt;</span>
            </span>
            <a
              href="https://situational-awareness.ai/wp-content/uploads/2024/06/situationalawareness.pdf"
              target="_blank" rel="noopener noreferrer"
              className="hover:t-text transition-colors"
            >
              full PDF ↗
            </a>
          </footer>
        </div>
      </div>

      <SettingsWindow />
    </>
  )
}
