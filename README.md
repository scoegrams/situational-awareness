# Situational Awareness Terminal

A CRT-style command console + interactive knowledge graph explorer.

## Run locally

```bash
npm install
npm run dev
```

## Commands

- `help`
- `map`
- `nodes`
- `open <id>`
- `trace <id>`
- `timeline`
- `clear` (or `Ctrl+L`)

## Edit the graph

`src/lib/graphData.js`

- `nodes`: `{ id, title, summary }`
- `links`: `{ source, target, label }`

## Notes

This project ships with **summaries** and a **concept map** structure.
If you add full text content from external sources, consider licensing/copyright.
