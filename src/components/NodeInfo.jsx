import React from 'react'

export default function NodeInfo({ node, neighbors, onOpen }) {
  if (!node) {
    return (
      <div>
        <div className="text-sm opacity-90">NODE INFO</div>
        <div className="mt-2 text-xs opacity-70 leading-relaxed">
          No node selected.
          <div className="mt-2">
            Try: <span className="opacity-90">open compute_scaling</span> or click a node.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-sm opacity-90">NODE INFO</div>
      <div className="mt-3">
        <div className="text-base font-semibold">{node.title}</div>
        <div className="mt-1 text-xs opacity-75">ID: {node.id}</div>
      </div>

      <div className="mt-3 text-sm opacity-80 leading-relaxed">{node.summary}</div>

      <div className="mt-4">
        <div className="text-xs opacity-70">CONNECTED NODES</div>
        {neighbors?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {neighbors.map((id) => (
              <button
                key={id}
                onClick={() => onOpen?.(id)}
                className="border border-[rgba(0,255,136,0.35)] px-2 py-1 text-xs hover:bg-[rgba(0,255,136,0.06)]"
              >
                {id}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-xs opacity-60">(none)</div>
        )}
      </div>
    </div>
  )
}
