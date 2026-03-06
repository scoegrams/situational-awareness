import React from 'react'
import { CHAPTERS } from '../lib/graphData.js'

function ChapterBadge({ chapter }) {
  if (!chapter || !CHAPTERS[chapter]) return null
  const ch = CHAPTERS[chapter]
  return (
    <a
      href={ch.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block border t-border px-2.5 py-1 text-xs tracking-wider t-muted hover:t-text hover:border-[var(--border)] transition-colors font-semibold"
      title={`Read essay: ${ch.label}`}
    >
      {ch.label} ↗
    </a>
  )
}

export default function NodeInfo({ node, neighborNodes, onOpen }) {
  if (!node) {
    return (
      <div className="h-full">
        <div className="text-xs tracking-widest t-muted font-semibold mb-3">NODE DETAILS</div>
        <div className="text-sm t-muted leading-relaxed space-y-2">
          <p>Select a node to read its summary.</p>
          <p>
            Click any node in the graph, or type{' '}
            <span className="t-text border t-border px-1.5 py-0.5">open agi_by_2027</span>
          </p>
          <p>
            Type <span className="t-text border t-border px-1.5 py-0.5">help</span> to see all commands.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="text-xs tracking-widest t-muted font-semibold">NODE DETAILS</div>

      <div>
        <div className="text-lg font-bold leading-snug t-accent">{node.title}</div>
        <div className="mt-1 text-xs t-dim">id: {node.id}</div>
      </div>

      {node.chapter && <ChapterBadge chapter={node.chapter} />}

      <p className="text-sm t-text leading-relaxed">{node.summary}</p>

      {node.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {node.keywords.map(kw => (
            <span key={kw} className="text-xs border t-border-dim px-2 py-0.5 t-muted">
              {kw}
            </span>
          ))}
        </div>
      )}

      <div>
        <div className="text-xs tracking-widest t-muted font-semibold mb-2">
          CONNECTED NODES ({neighborNodes?.length ?? 0})
        </div>
        {neighborNodes?.length ? (
          <div className="flex flex-col gap-1.5">
            {neighborNodes.map(nb => (
              <button
                key={nb.id}
                onClick={() => onOpen?.(nb.id)}
                className="text-left border t-border-dim px-3 py-1.5 text-sm t-text t-hover hover:border-[var(--border)] transition-colors"
              >
                <span>{nb.title}</span>
                <span className="t-dim ml-2 text-xs">{nb.id}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm t-dim">(none)</div>
        )}
      </div>
    </div>
  )
}
