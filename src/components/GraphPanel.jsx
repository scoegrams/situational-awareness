import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useTheme } from '../lib/theme.jsx'

const CHAPTER_COLORS = {
  I:    '#00ff88',
  II:   '#00e5ff',
  IIIa: '#ffd700',
  IIIb: '#ff6b6b',
  IIIc: '#c77dff',
  IIId: '#ff9f43',
  IV:   '#48dbfb',
}

const CHAPTER_COLORS_LIGHT = {
  I:    '#1a7a4a',
  II:   '#005f7a',
  IIIa: '#7c4a00',
  IIIb: '#b52b2b',
  IIIc: '#6a2da0',
  IIId: '#7a3c00',
  IV:   '#006080',
}

// Human-readable chapter names for the radial arms
const CHAPTER_NAMES = {
  I:    'Counting OOMs',
  II:   'Intelligence Explosion',
  IIIa: 'The Cluster',
  IIIb: 'Lock Down Labs',
  IIIc: 'Superalignment',
  IIId: 'Geopolitics',
  IV:   'The Project',
}

function chapterColor(ch, isDark = true) {
  return (isDark ? CHAPTER_COLORS : CHAPTER_COLORS_LIGHT)[ch] || '#888'
}

// ── Radial tree layout ────────────────────────────────────────────────────────
// 7 chapters arranged evenly around a circle.
// Each chapter's nodes fan out radially from the center, spaced along the arm.
const CANVAS_W  = 700
const CANVAS_H  = 700
const CX        = CANVAS_W / 2    // center x
const CY        = CANVAS_H / 2    // center y
const ARM_START = 90              // px from center where first node sits
const ARM_STEP  = 58              // px between consecutive nodes on same arm
const NODE_R    = 6
const HIT_R     = 18

const CHAPTER_ORDER = ['I', 'II', 'IIIa', 'IIIb', 'IIIc', 'IIId', 'IV']

function assignPositions(nodes) {
  // Group by chapter
  const buckets = {}
  for (const n of nodes) {
    if (!buckets[n.chapter]) buckets[n.chapter] = []
    buckets[n.chapter].push(n)
  }

  const out = []
  const total = CHAPTER_ORDER.length
  CHAPTER_ORDER.forEach((ch, chIdx) => {
    const bucket = buckets[ch] || []
    // Evenly space chapter arms around the full circle
    // Offset by -90° so chapter I points up
    const angle = (chIdx / total) * 2 * Math.PI - Math.PI / 2

    bucket.forEach((n, i) => {
      const dist = ARM_START + i * ARM_STEP
      out.push({
        ...n,
        fx: CX + Math.cos(angle) * dist,
        fy: CY + Math.sin(angle) * dist,
        _armAngle: angle,
        _armIdx: i,
        _chFirst: i === 0,
      })
    })
  })
  return out
}

export default function GraphPanel({ graph, selectedId, neighborSet, onSelect }) {
  const fgRef = useRef(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const canvasBg   = isDark ? '#000000' : '#ede8de'
  const linkActive = isDark ? 'rgba(0,255,136,0.70)' : 'rgba(0,0,0,0.55)'
  const linkIdle   = isDark ? 'rgba(0,255,136,0.15)' : 'rgba(0,0,0,0.13)'
  const linkGlow   = isDark ? 'rgba(0,255,136,0.5)'  : 'rgba(0,0,0,0.3)'

  const data = useMemo(() => ({
    nodes: assignPositions(graph.nodes.map((n) => ({ ...n }))),
    links: graph.links.map((l) => ({ ...l })),
  }), [graph])

  // Fit on mount
  useEffect(() => {
    const t = setTimeout(() => {
      try { fgRef.current?.zoomToFit?.(300, 40) } catch { /* ignore */ }
    }, 200)
    return () => clearTimeout(t)
  }, [])

  // Pan to selected node
  useEffect(() => {
    if (!selectedId || !fgRef.current) return
    const node = data.nodes.find((n) => n.id === selectedId)
    if (node?.fx != null) {
      try { fgRef.current.centerAt(node.fx, node.fy, 400) } catch { /* ignore */ }
    }
  }, [selectedId, data.nodes])

  const drawNode = useCallback((node, ctx, globalScale) => {
    const isSelected = node.id === selectedId
    const isNeighbor = !isSelected && neighborSet?.has?.(node.id)
    const isDimmed   = !!selectedId && !isSelected && !isNeighbor
    const col = chapterColor(node.chapter, isDark)
    const r   = isSelected ? NODE_R + 2 : NODE_R

    // ── Chapter label above the first node on each arm ──
    if (node._chFirst) {
      const angle   = node._armAngle
      // Push the chapter label a bit further out than the first node
      const labelDist = ARM_START - 28
      const lx = CX + Math.cos(angle) * labelDist
      const ly = CY + Math.sin(angle) * labelDist
      const fs = Math.max(8, 9.5 / globalScale)
      ctx.save()
      ctx.font = `700 ${fs}px ui-monospace, Menlo, Monaco, Consolas, "Courier New", monospace`
      // Align text away from center
      const rightHalf = Math.cos(angle) >= -0.1
      ctx.textAlign    = rightHalf ? 'left' : 'right'
      ctx.textBaseline = 'middle'
      ctx.globalAlpha  = isDimmed ? 0.2 : 0.6
      ctx.fillStyle    = col
      ctx.shadowColor  = isDark ? col : 'transparent'
      ctx.shadowBlur   = isDark ? 8 : 0
      // Chapter name
      const name = CHAPTER_NAMES[node.chapter] || node.chapter
      const offsetX = rightHalf ? 4 : -4
      ctx.fillText(name, lx + offsetX, ly)
      ctx.restore()
    }

    // ── Pulse ring ──
    if (isSelected) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(node.x, node.y, r + 7, 0, 2 * Math.PI)
      ctx.strokeStyle = col; ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.38
      ctx.shadowColor = col; ctx.shadowBlur = isDark ? 20 : 0
      ctx.stroke(); ctx.restore()
    }

    // ── Dot ──
    ctx.save()
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
    ctx.fillStyle   = col
    ctx.globalAlpha = isDimmed ? 0.15 : 1
    ctx.shadowColor = col
    ctx.shadowBlur  = isDark ? (isSelected ? 26 : isNeighbor ? 16 : 8) : 0
    ctx.fill(); ctx.restore()

    // ── Node label — placed radially outward from center ──
    const angle     = node._armAngle
    const fs        = Math.max(10, 12 / globalScale)
    const labelGap  = r + 7

    // Decide which side of the dot to put the label (away from center)
    const rightHalf = Math.cos(angle) >= -0.15
    const topHalf   = Math.sin(angle) < -0.15

    ctx.save()
    ctx.font         = `600 ${fs}px ui-monospace, Menlo, Monaco, Consolas, "Courier New", monospace`
    ctx.textBaseline = 'middle'
    ctx.globalAlpha  = isDimmed ? 0.18 : isSelected ? 1 : 0.90
    ctx.fillStyle    = isDark ? col : '#1a1a1a'
    ctx.shadowColor  = isDark ? col : 'transparent'
    ctx.shadowBlur   = isDark ? (isSelected ? 14 : 4) : 0

    if (rightHalf) {
      ctx.textAlign = 'left'
      ctx.fillText(node.title, node.x + labelGap, node.y)
    } else {
      ctx.textAlign = 'right'
      ctx.fillText(node.title, node.x - labelGap, node.y)
    }
    ctx.restore()
  }, [selectedId, neighborSet, isDark])

  const drawLink = useCallback((link, ctx) => {
    const s = typeof link.source === 'object' ? link.source : null
    const t = typeof link.target === 'object' ? link.target : null
    if (!s || !t || s.x == null || t.x == null) return
    const active = neighborSet?.has?.(s.id) && neighborSet?.has?.(t.id)
    const dimmed = !!selectedId && !active
    ctx.save()
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(t.x, t.y)
    ctx.strokeStyle = active ? linkActive : linkIdle
    ctx.lineWidth   = active ? 1.5 : 0.7
    ctx.globalAlpha = dimmed ? 0.12 : 1
    ctx.shadowColor = linkGlow; ctx.shadowBlur = active ? 8 : 0
    ctx.stroke(); ctx.restore()
  }, [selectedId, neighborSet, linkActive, linkIdle, linkGlow])

  const paintPointerArea = useCallback((node, color, ctx) => {
    ctx.beginPath()
    ctx.arc(node.x, node.y, HIT_R, 0, 2 * Math.PI)
    ctx.fillStyle = color; ctx.fill()
  }, [])

  const legendEntries = useMemo(() => {
    const seen = new Set()
    return graph.nodes
      .filter((n) => { if (seen.has(n.chapter)) return false; seen.add(n.chapter); return true })
      .map((n) => ({ chapter: n.chapter, color: chapterColor(n.chapter, isDark) }))
  }, [graph, isDark])

  const selectedNode = graph.nodes.find((n) => n.id === selectedId)

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b t-border-dim text-xs flex items-center justify-between">
        <span className="t-muted tracking-widest font-semibold">CONCEPT GRAPH · scroll to zoom · click node</span>
        {selectedNode
          ? <span style={{ color: chapterColor(selectedNode.chapter, isDark) }} className="text-xs font-semibold truncate max-w-[160px]">● {selectedNode.title}</span>
          : <span className="t-faint text-xs">no selection</span>
        }
      </div>

      {/* Graph canvas */}
      <div className="flex items-center justify-center overflow-hidden" style={{ height: CANVAS_H, background: canvasBg }}>
        <ForceGraph2D
          ref={fgRef}
          width={CANVAS_W}
          height={CANVAS_H}
          graphData={data}
          backgroundColor={canvasBg}
          cooldownTicks={0}
          d3AlphaMin={1}
          nodeRelSize={HIT_R}
          onNodeClick={(node) => onSelect?.(node.id)}
          nodeCanvasObject={drawNode}
          nodeCanvasObjectMode={() => 'replace'}
          nodePointerAreaPaint={paintPointerArea}
          linkCanvasObjectMode={() => 'replace'}
          linkCanvasObject={drawLink}
          enableNodeDrag={false}
          enablePanInteraction
          enableZoomInteraction
        />
      </div>

      {/* Chapter color legend */}
      <div className="px-3 py-2 border-t t-border-dim flex flex-wrap gap-x-3 gap-y-1">
        {legendEntries.map(({ chapter, color }) => (
          <span key={chapter} className="flex items-center gap-1.5 text-xs">
            <span className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ background: color, boxShadow: isDark ? `0 0 5px ${color}` : 'none' }} />
            <span style={{ color: isDark ? color : '#333' }} className="font-semibold">{chapter}</span>
            <span className="t-faint">·</span>
            <span className="t-faint">{CHAPTER_NAMES[chapter]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

