/**
 * One-off generator: builds flat SVG files from lucide-react icon modules (ISC).
 * Run: node scripts/gen-lucide-svgs.mjs
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const iconsDir = path.join(root, "node_modules/lucide-react/dist/esm/icons")
const outDir = path.join(root, "src/assets/icons")

/** Output filename (no .svg) -> lucide module basename */
const map = {
  "arrow-up": "arrow-up",
  globe: "globe",
  "link-2": "link-2",
  "message-square": "message-square",
  "mouse-pointer-2": "mouse-pointer-2",
  plus: "plus",
  send: "send",
  shuffle: "shuffle",
  "arrow-left": "arrow-left",
  bell: "bell",
  home: "house",
  "square-plus": "square-plus",
  x: "x",
  "more-vertical": "ellipsis-vertical",
  "battery-full": "battery-full",
  monitor: "monitor",
  signal: "signal",
  smartphone: "smartphone",
  wifi: "wifi",
  copy: "copy",
  "share-2": "share-2",
  "external-link": "external-link",
}

function loadIconNode(moduleBase) {
  const fp = path.join(iconsDir, `${moduleBase}.js`)
  const code = fs.readFileSync(fp, "utf8")
  const m = code.match(/const __iconNode = (\[[\s\S]*?\n\]);/)
  if (!m) {
    throw new Error(`Could not parse __iconNode in ${fp}`)
  }
  return Function(`"use strict"; return (${m[1]})`)()
}

function attrsToString(attrs) {
  return Object.entries(attrs)
    .filter(([k]) => k !== "key")
    .map(([k, v]) => `${k}="${String(v).replace(/&/g, "&amp;")}"`)
    .join(" ")
}

function iconNodeToSvgBody(nodes) {
  return nodes
    .map(([tag, attrs]) => {
      const inner = attrsToString(attrs)
      return inner ? `<${tag} ${inner} />` : `<${tag} />`
    })
    .join("")
}

function buildSvg(nodes) {
  const body = iconNodeToSvgBody(nodes)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
${body}
</svg>
`
}

fs.mkdirSync(outDir, { recursive: true })

for (const [outName, mod] of Object.entries(map)) {
  const nodes = loadIconNode(mod)
  const svg = buildSvg(nodes)
  fs.writeFileSync(path.join(outDir, `${outName}.svg`), svg, "utf8")
  console.log("wrote", `${outName}.svg`)
}
