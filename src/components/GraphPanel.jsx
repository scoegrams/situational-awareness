import React, { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

function useSize(ref) {
  const [size, setSize] = useState({ width: 800, height: 520 })

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      setSize({ width: Math.max(320, Math.floor(rect.width)), height: Math.max(420, Math.floor(rect.height)) })
    })

    ro.observe(el)
    const rect = el.getBoundingClientRect()
    setSize({ width: Math.max(320, Math.floor(rect.width)), height: Math.max(420, Math.floor(rect.height)) })

    return () => ro.disconnect()
  }, [ref])

  return size
}

export default function GraphPanel({ graph, selectedId, neighborSet, onSelect }) {
  const wrapRef = useRef(null)
  const fgRef = useRef(null)
  const { width, height } = useSize(wrapRef)

  const data = useMemo(() => {
    // react-force-graph mutates node/link objects (adds x/y/vx/vy)
    // so we provide a shallow copy to avoid weirdness if re-rendered.
    return {
      nodes: graph.nodes.map((n) => ({ ...n })),
      links: graph.links.map((l) => ({ ...l }))
    }
  }, [graph])

  useEffect(() => {
    // Nudge camera to fit after first render
    const t = setTimeout(() => {
      try {
        fgRef.current?.zoomToFit?.(600, 60)
      } catch {
        // ignore
      }
    }, 250)
    return () => clearTimeout(t)
  }, [])

  function drawNode(node, ctx, globalScale) {
    const isSelected = node.id === selectedId
    const isNeighbor = neighborSet?.has?.(node.id)

    const label = node.title
    const fontSize = Math.max(10, 14 / globalScale)

    // Node radius
    const r = isSelected ? 7 : isNeighbor ? 6 : 5

    // Glow
    ctx.save()
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
    ctx.fillStyle = isSelected
      ? 'rgba(0,255,136,0.95)'
      : isNeighbor
      ? 'rgba(0,255,136,0.75)'
      : 'rgba(0,255,136,0.45)'
    ctx.shadowColor = 'rgba(0,255,136,0.9)'
    ctx.shadowBlur = isSelected ? 18 : isNeighbor ? 12 : 8
    ctx.fill()
    ctx.restore()

    // Label
    if (globalScale < 2.8 || isSelected) {
      ctx.save()
      ctx.font = `${fontSize}px ui-monospace, Menlo, Monaco, Consolas, "Courier New", monospace`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = isSelected ? 'rgba(0,255,136,0.95)' : 'rgba(0,255,136,0.55)'
      ctx.shadowColor = 'rgba(0,255,136,0.6)'
      ctx.shadowBlur = 6
      ctx.fillText(label, node.x + 10, node.y)
      ctx.restore()
    }
  }

  function drawLink(link, ctx) {
    const src = link.source
    const tgt = link.target

    // src/tgt can be objects after force-graph resolves
    const s = typeof src === 'object' ? src : null
    const t = typeof tgt === 'object' ? tgt : null
    if (!s || !t) return

    const active = neighborSet?.has?.(s.id) && neighborSet?.has?.(t.id)

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(t.x, t.y)
    ctx.strokeStyle = active ? 'rgba(0,255,136,0.25)' : 'rgba(0,255,136,0.12)'
    ctx.lineWidth = active ? 1.2 : 0.8
    ctx.shadowColor = 'rgba(0,255,136,0.35)'
    ctx.shadowBlur = active ? 10 : 4
    ctx.stroke()
    ctx.restore()
  }

  return (
    <div ref={wrapRef} className="w-full h-full">
      <div className="px-4 py-3 border-b border-[rgba(0,255,136,0.25)] text-xs opacity-80 flex items-center justify-between">
        <span>GRAPH · drag/zoom · click node to open</span>
        <span className="opacity-90">{selectedId ? `FOCUS: ${selectedId}` : 'FOCUS: (none)'}</span>
      </div>

      <ForceGraph2D
        ref={fgRef}
        width={width}
        height={height - 44}
        graphData={data}
        backgroundColor="#000000"
        nodeRelSize={4}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1}
        linkDirectionalParticleSpeed={0.006}
        cooldownTicks={120}
        onNodeClick={(node) => onSelect?.(node.id)}
        nodeCanvasObject={drawNode}
        linkCanvasObjectMode={() => 'after'}
        linkCanvasObject={drawLink}
        enableNodeDrag
      />
    </div>
  )
}
