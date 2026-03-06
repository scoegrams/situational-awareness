import React, { useEffect, useMemo, useRef, useState } from 'react'
import Terminal from './components/Terminal.jsx'
import GraphPanel from './components/GraphPanel.jsx'
import NodeInfo from './components/NodeInfo.jsx'
import { graph, mapAscii, timelineLines } from './lib/graphData.js'

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

export default function App() {
  const [lines, setLines] = useState([])
  const [booted, setBooted] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const adj = useMemo(() => buildAdjacency(graph), [])
  const selectedNode = useMemo(
    () => graph.nodes.find((n) => n.id === selectedId) || null,
    [selectedId]
  )

  const neighborSet = useMemo(() => {
    if (!selectedId) return new Set()
    return new Set([selectedId, ...(adj.get(selectedId) ?? [])])
  }, [adj, selectedId])

  const bootTimersRef = useRef([])

  function addLine(text, kind = 'output') {
    setLines((prev) => [...prev, { kind, text }])
  }

  function clearTerminal() {
    setLines([])
  }

  function openNode(id) {
    const node = graph.nodes.find((n) => n.id === id)
    if (!node) {
      addLine(`ERROR: node not found: ${id}`, 'error')
      return
    }
    setSelectedId(id)
    addLine(`OPEN ${node.id} :: ${node.title}`, 'system')
    addLine(node.summary, 'output')

    const neighbors = [...(adj.get(id) ?? [])]
    if (neighbors.length) {
      addLine(`LINKS: ${neighbors.join(', ')}`, 'output')
    } else {
      addLine('LINKS: (none)', 'output')
    }
  }

  function cmdHelp() {
    addLine('AVAILABLE COMMANDS:', 'system')
    addLine('  help', 'output')
    addLine('  map', 'output')
    addLine('  nodes', 'output')
    addLine('  open <id>', 'output')
    addLine('  trace <id>', 'output')
    addLine('  timeline', 'output')
    addLine('  clear   (or Ctrl+L)', 'output')
  }

  function cmdNodes() {
    addLine(`NODES: ${graph.nodes.length}`, 'system')
    for (const n of graph.nodes) {
      addLine(`- ${n.id} :: ${n.title}`, 'output')
    }
  }

  function cmdMap() {
    addLine('TOPOLOGY MAP:', 'system')
    mapAscii
      .trimEnd()
      .split('\n')
      .forEach((ln) => addLine(ln, 'output'))
  }

  function cmdTimeline() {
    addLine('TIMELINE (projection):', 'system')
    timelineLines.forEach((ln) => addLine(ln, 'output'))
  }

  function cmdTrace(id) {
    if (!id) {
      addLine('USAGE: trace <id>', 'error')
      return
    }
    if (!adj.has(id)) {
      addLine(`ERROR: node not found: ${id}`, 'error')
      return
    }

    addLine(`TRACE ${id} (depth=2)`, 'system')
    const rows = bfsTrace(adj, id, 2)

    for (const r of rows) {
      const indent = '  '.repeat(r.depth)
      const neighbors = r.neighbors.length ? r.neighbors.join(', ') : '(none)'
      addLine(`${indent}${r.id} -> ${neighbors}`, 'output')
    }
  }

  function onCommand(raw) {
    const cmd = raw.trim()
    if (!cmd) return

    // echo input
    addLine(`> ${cmd}`, 'input')

    const [head, ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ')

    switch (head.toLowerCase()) {
      case 'help':
        cmdHelp()
        break
      case 'clear':
        clearTerminal()
        break
      case 'map':
        cmdMap()
        break
      case 'nodes':
        cmdNodes()
        break
      case 'open':
        if (!arg) {
          addLine('USAGE: open <id>', 'error')
          break
        }
        openNode(arg)
        break
      case 'trace':
        cmdTrace(arg)
        break
      case 'timeline':
        cmdTimeline()
        break
      default:
        addLine(`ERROR: unknown command: ${head}`, 'error')
        addLine('Type `help` for a list of commands.', 'output')
    }
  }

  function boot() {
    // Clear any prior timers
    bootTimersRef.current.forEach((t) => clearTimeout(t))
    bootTimersRef.current = []

    const bootLines = [
      { kind: 'system', text: 'INITIALIZING SITUATIONAL_AWARENESS.SYS' },
      { kind: 'system', text: 'LOADING KNOWLEDGE GRAPH...' },
      { kind: 'output', text: `NODES: ${graph.nodes.length}` },
      { kind: 'output', text: `EDGES: ${graph.links.length}` },
      { kind: 'output', text: 'TYPE `help` FOR COMMANDS' },
      { kind: 'system', text: 'SYSTEM READY' }
    ]

    setLines([])
    setBooted(false)

    bootLines.forEach((l, idx) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, l])
        if (idx === bootLines.length - 1) setBooted(true)
      }, 250 + idx * 240)
      bootTimersRef.current.push(t)
    })
  }

  useEffect(() => {
    boot()
    return () => {
      bootTimersRef.current.forEach((t) => clearTimeout(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="scanlines flicker min-h-screen">
      <div className="mx-auto max-w-[1400px] p-4 md:p-6 crt-glow curve">
        <header className="mb-4 flex items-baseline justify-between border border-[rgba(0,255,136,0.35)] px-4 py-3">
          <div className="text-lg md:text-xl font-semibold tracking-wide">
            SITUATIONAL AWARENESS TERMINAL
          </div>
          <div className="text-xs md:text-sm opacity-80">
            v0.1 · {booted ? 'READY' : 'BOOTING'}
          </div>
        </header>

        <main className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <section className="md:col-span-5 flex flex-col gap-4">
            <div className="border border-[rgba(0,255,136,0.35)]">
              <Terminal lines={lines} onCommand={onCommand} onClear={clearTerminal} />
            </div>

            <div className="border border-[rgba(0,255,136,0.35)] p-4">
              <NodeInfo
                node={selectedNode}
                neighbors={[...(adj.get(selectedId) ?? [])]}
                onOpen={openNode}
              />
            </div>
          </section>

          <section className="md:col-span-7 border border-[rgba(0,255,136,0.35)] min-h-[520px]">
            <GraphPanel
              graph={graph}
              selectedId={selectedId}
              neighborSet={neighborSet}
              onSelect={(id) => {
                openNode(id)
              }}
            />
          </section>
        </main>

        <footer className="mt-4 text-xs opacity-70">
          Tip: click nodes in the graph, or type <span className="opacity-90">open ai_scaling_laws</span>
        </footer>
      </div>
    </div>
  )
}
