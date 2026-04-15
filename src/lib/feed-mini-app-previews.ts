/** Self-contained HTML documents for feed preview iframes (no external assets). */

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return h
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function doc(bodyInner: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${bodyInner}</body></html>`
}

/**
 * Bazar-inspired marketplace (https://bazar.arweave.net) — light listing grid, search,
 * AR pricing. Self-contained; no network.
 */
export function buildBazarStylePreviewHtml(appName: string): string {
  const featured = escapeHtml(
    appName.length > 26 ? `${appName.slice(0, 24)}…` : appName
  )
  return doc(`<style>
    *{box-sizing:border-box;margin:0}
    html,body{height:100%;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased}
    body{background:#eceef2;color:#111827;display:flex;flex-direction:column;min-height:100%}
    .top{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#fff;border-bottom:1px solid #e5e7eb}
    .brand{font-size:14px;font-weight:500;letter-spacing:-.03em;color:#111827}
    .live{font-size:8px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#047857;padding:3px 7px;border-radius:999px;background:#ecfdf5;border:1px solid #a7f3d0}
    .search{margin:8px 10px;padding:8px 10px;border-radius:10px;background:#fff;border:1px solid #e5e7eb;font-size:9px;color:#6b7280}
    .grid{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:0 10px 10px;align-content:start}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(15,23,42,.05)}
    .thumb{height:54px;background:linear-gradient(160deg,#f8fafc,#e2e8f0);position:relative}
    .thumb::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 35% 25%,rgba(13,148,136,.12),transparent 60%)}
    .body{padding:8px 9px 9px}
    .t{font-size:9px;font-weight:500;color:#0f172a;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .p{margin-top:5px;font-size:10px;font-weight:500;font-variant-numeric:tabular-nums;color:#0f766e}
    .sub{font-size:7px;color:#64748b;margin-top:2px}
  </style>
  <div class="top"><span class="brand">Bazar</span><span class="live">Live</span></div>
  <div class="search" role="search">Search listings on Arweave…</div>
  <div class="grid">
    <div class="card"><div class="thumb"></div><div class="body"><div class="t">${featured}</div><div class="p">0.42 AR</div><div class="sub">Buy now</div></div></div>
    <div class="card"><div class="thumb" style="background:linear-gradient(160deg,#ecfccb,#bef264)"></div><div class="body"><div class="t">Llamaland</div><div class="p">1.08 AR</div><div class="sub">Game</div></div></div>
    <div class="card"><div class="thumb" style="background:linear-gradient(160deg,#ccfbf1,#99f6e4)"></div><div class="body"><div class="t">Wayfinder route #12</div><div class="p">0.03 AR</div><div class="sub">UCM</div></div></div>
    <div class="card"><div class="thumb" style="background:linear-gradient(160deg,#ffedd5,#fed7aa)"></div><div class="body"><div class="t">Profile badge mint</div><div class="p">2.40 AR</div><div class="sub">Auction</div></div></div>
  </div>`)
}

/** Playful grass-and-sky mock for the Llamaland feed row (distinct from Bazar marketplace). */
export function buildLlamalandGamePreviewHtml(): string {
  return doc(`<style>
    *{box-sizing:border-box;margin:0}
    html,body{height:100%;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
    body{background:linear-gradient(180deg,#7dd3fc 0%,#38bdf8 28%,#86efac 28%,#4ade80 52%,#3f6212 52%,#14532d 100%);display:flex;flex-direction:column;color:#0f172a}
    .bar{display:flex;justify-content:space-between;align-items:center;padding:5px 8px;background:rgba(15,23,42,.82);color:#e0f2fe;font-size:8px;font-weight:500;letter-spacing:.02em}
    .bar span:last-child{font-variant-numeric:tabular-nums;opacity:.95}
    .stage{flex:1;position:relative;min-height:0}
    .sun{position:absolute;width:22px;height:22px;border-radius:50%;background:#fde047;box-shadow:0 0 14px rgba(250,204,21,.65);top:10%;right:12%}
    .cloud{position:absolute;background:rgba(255,255,255,.88);border-radius:999px;opacity:.92}
    .c1{width:32px;height:11px;top:12%;left:8%}
    .c2{width:24px;height:9px;top:18%;left:28%}
    .tag{position:absolute;top:26%;left:0;right:0;text-align:center;font-size:10px;font-weight:500;color:#1e3a8a;text-shadow:0 1px 0 rgba(255,255,255,.5);letter-spacing:-.03em}
    .llama{position:absolute;left:50%;bottom:38%;transform:translateX(-50%);width:48px;height:40px}
    .bod{width:36px;height:22px;background:#fef9c3;border:2px solid #713f12;border-radius:12px 12px 8px 8px;position:absolute;bottom:0;left:50%;transform:translateX(-50%)}
    .neck{width:10px;height:12px;background:#fef9c3;border:2px solid #713f12;border-bottom:0;position:absolute;bottom:18px;left:50%;transform:translateX(-50%);border-radius:4px 4px 0 0}
    .head{width:26px;height:20px;background:#fefce8;border:2px solid #713f12;border-radius:12px;position:absolute;top:0;left:50%;transform:translateX(-50%)}
    .eye{width:4px;height:4px;background:#0f172a;border-radius:50%;position:absolute;top:8px}
    .e1{left:6px}.e2{right:6px}
    .ear{position:absolute;width:7px;height:12px;background:#fde047;border:1px solid #854d0e;border-radius:3px;top:-1px}
    .el{left:0;transform:rotate(-18deg)}.er{right:0;transform:rotate(18deg)}
    .cact{position:absolute;bottom:34%;width:11px;border-radius:4px;background:#15803d;border:1px solid #14532d}
    .cx1{left:10%;height:26px}.cx2{right:11%;height:20px}
    .hill{position:absolute;bottom:0;left:-10%;right:-10%;height:34%;background:linear-gradient(180deg,#65a30d,#3f6212);border-radius:50% 50% 0 0 / 18% 18% 0 0}
  </style>
  <div class="bar"><span>Llamaland</span><span>1,024 pts · Lv.3</span></div>
  <div class="stage">
    <div class="sun"></div>
    <div class="cloud c1"></div>
    <div class="cloud c2"></div>
    <div class="tag">Jump · mint · roam the permaweb</div>
    <div class="llama">
      <div class="head"><span class="ear el"></span><span class="ear er"></span><span class="eye e1"></span><span class="eye e2"></span></div>
      <div class="neck"></div>
      <div class="bod"></div>
    </div>
    <div class="cact cx1"></div>
    <div class="cact cx2"></div>
    <div class="hill"></div>
  </div>`)
}

/** Deterministic mini UI per fork — all variants are light mode (light surfaces, dark text). */
export function buildMiniAppPreviewHtml(forkId: string, appName: string): string {
  const h = hashString(forkId)
  const variant = h % 7
  const hue = h % 360
  const hue2 = (h * 17 + 40) % 360
  const hue3 = (h * 9 + 200) % 360
  const title = escapeHtml(
    appName.length > 30 ? `${appName.slice(0, 28)}…` : appName
  )
  const w = 42 + (h % 48)
  const n1 = (h % 890) + 12
  const n2 = (h * 3) % 420 + 8

  switch (variant) {
    case 0:
      return doc(`<style>
        *{box-sizing:border-box;margin:0}
        html,body{height:100%;font-family:ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        body{background:linear-gradient(165deg,hsl(${hue},36%,97%),hsl(${hue2},28%,94%));padding:10px}
        .g{display:grid;grid-template-columns:1fr 1fr;gap:8px;height:100%}
        .c{background:#fff;border-radius:11px;padding:10px;border:1px solid rgba(15,23,42,.06);box-shadow:0 2px 8px rgba(15,23,42,.06)}
        .l{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.07em;font-weight:500}
        .v{font-size:17px;font-weight:500;color:#0f172a;margin-top:4px;letter-spacing:-.02em}
        .b{height:4px;background:#e2e8f0;border-radius:2px;margin-top:8px;overflow:hidden}
        .b i{display:block;height:100%;width:${w}%;background:hsl(${hue},52%,40%);border-radius:2px}
      </style><div class="g">
        <div class="c"><div class="l">Net rev</div><div class="v">$${n1}k</div><div class="b"><i></i></div></div>
        <div class="c"><div class="l">Active</div><div class="v">${n2 * 37}</div><div class="b"><i style="width:${100 - (h % 40)}%"></i></div></div>
        <div class="c"><div class="l">Churn</div><div class="v">${(h % 12) / 10}%</div><div class="b"><i style="width:28%"></i></div></div>
        <div class="c"><div class="l">Uptime</div><div class="v">99.${h % 9}9%</div><div class="b"><i style="width:96%"></i></div></div>
      </div>`)

    case 1:
      return doc(`<style>
        *{box-sizing:border-box;margin:0}
        html,body{height:100%;font-family:ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        body{background:linear-gradient(165deg,#f8fafc,hsl(${hue},28%,94%));padding:14px;display:flex;flex-direction:column;justify-content:center;color:#0f172a}
        h1{font-size:15px;font-weight:500;line-height:1.2;letter-spacing:-.02em;color:#0f172a}
        p{margin-top:8px;font-size:10px;color:#475569;line-height:1.45;max-width:28em}
        .r{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap}
        a{font-size:10px;padding:7px 14px;border-radius:999px;text-decoration:none;font-weight:500}
        .p{background:hsl(${hue},42%,38%);color:#fff;box-shadow:0 1px 3px rgba(15,23,42,.12)}
        .s{border:1px solid #e2e8f0;color:#334155;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.05)}
      </style>
        <h1>${title}</h1>
        <p>Ship faster with permaweb-native previews. No cold starts on the edge.</p>
        <div class="r"><a class="p" href="#">Try live</a><a class="s" href="#">Docs</a></div>`)

    case 2:
      return doc(`<style>
        *{box-sizing:border-box;margin:0}
        html,body{height:100%;font-family:ui-sans-serif,system-ui,sans-serif;font-size:10px;-webkit-font-smoothing:antialiased}
        body{background:#f1f5f9;color:#0f172a;padding:12px}
        .t{color:#0369a1;font-weight:500;margin-bottom:8px}
        .s{display:flex;align-items:center;gap:8px;margin:10px 0}
        .d{width:10px;height:10px;border-radius:50%;background:hsl(${hue},55%,48%);border:1px solid rgba(15,23,42,.08)}
        .l{flex:1;height:2px;background:#cbd5e1;border-radius:1px}
        .x{color:#64748b}
      </style>
        <div class="t">deploy · ${title}</div>
        <div class="s"><div class="d"></div><div class="l"></div><span class="x">build</span></div>
        <div class="s"><div class="d" style="background:#94a3b8"></div><div class="l"></div><span class="x">test</span></div>
        <div class="s"><div class="d" style="background:#10b981"></div><div class="l"></div><span style="color:#0f172a;font-weight:500">prod</span></div>`)

    case 3:
      return doc(`<style>
        *{box-sizing:border-box;margin:0}
        html,body{height:100%;font-family:ui-sans-serif,system-ui,sans-serif;background:#f8fafc;padding:10px;-webkit-font-smoothing:antialiased}
        .h{font-size:10px;font-weight:500;color:#334155;margin-bottom:8px}
        svg{width:100%;height:72px}
      </style>
        <div class="h">${title} · sessions</div>
        <svg viewBox="0 0 280 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(${hue},55%,50%)" stop-opacity=".35"/><stop offset="100%" stop-color="hsl(${hue},55%,50%)" stop-opacity="0"/></linearGradient></defs>
          <path d="M0,50 L40,${35 + (h % 20)} L80,${28 + (h % 25)} L120,${40 + (h % 15)} L160,${22 + (h % 18)} L200,${32 + (h % 22)} L240,${18 + (h % 20)} L280,${30 + (h % 12)}" fill="none" stroke="hsl(${hue},55%,45%)" stroke-width="2"/>
          <path d="M0,50 L40,${35 + (h % 20)} L80,${28 + (h % 25)} L120,${40 + (h % 15)} L160,${22 + (h % 18)} L200,${32 + (h % 22)} L240,${18 + (h % 20)} L280,${30 + (h % 12)} L280,72 L0,72 Z" fill="url(#g)"/>
        </svg>`)

    case 4:
      return doc(`<style>
        *{box-sizing:border-box;margin:0}
        html,body{height:100%;font-family:ui-sans-serif,system-ui,sans-serif;background:hsl(${hue2},25%,94%);padding:12px}
        .c{background:#fff;border-radius:12px;padding:12px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
        .t{font-size:9px;color:#64748b}
        .a{font-size:20px;font-weight:500;margin-top:4px;color:#0f172a}
        ul{margin-top:10px;padding-left:16px;font-size:10px;color:#334155;line-height:1.55}
      </style><div class="c">
        <div class="t">${title}</div>
        <div class="a">Launch checklist</div>
        <ul><li>Env keys rotated</li><li>Preview URL pinned</li><li>Smoke tests green</li></ul>
      </div>`)

    case 5:
      return doc(`<style>
        *{box-sizing:border-box;margin:0}
        html,body{height:100%;font-family:ui-sans-serif,system-ui,sans-serif;background:linear-gradient(180deg,hsl(${hue3},25%,97%),#fff);padding:12px;-webkit-font-smoothing:antialiased}
        p{font-size:10px;color:#475569;margin-bottom:8px}
        #n{font-size:26px;font-weight:500;color:hsl(${hue},45%,32%)}
        button{margin-top:10px;padding:8px 14px;border:none;border-radius:10px;background:#334155;color:#fff;font-weight:500;font-size:11px;cursor:pointer;box-shadow:0 1px 2px rgba(15,23,42,.08)}
      </style>
        <p>${title}</p>
        <div>Visitors</div>
        <div id="n">0</div>
        <button type="button" id="b">+1 visitor</button>
        <script>document.getElementById("b").onclick=function(){var e=document.getElementById("n");e.textContent=1+ +e.textContent;}<\/script>`)

    default:
      return doc(`<style>
        *{box-sizing:border-box;margin:0}
        html,body{height:100%;font-family:ui-sans-serif,system-ui,sans-serif;background:#f1f5f9;padding:10px}
        .h{font-size:10px;font-weight:500;color:#0f172a;margin-bottom:8px}
        .r{display:flex;gap:6px;flex-wrap:wrap}
        .p{background:#fff;border-radius:8px;padding:8px 10px;font-size:9px;border:1px solid #e2e8f0;box-shadow:0 1px 2px rgba(0,0,0,.04)}
        .g{color:#16a34a;font-weight:500}
        .m{color:#ca8a04}
        .f{margin-top:10px;font-size:9px;color:#64748b;line-height:1.45}
      </style>
        <div class="h">${title}</div>
        <div class="r">
          <div class="p"><span class="g">●</span> preview</div>
          <div class="p"><span class="m">◐</span> staging</div>
          <div class="p"><span style="color:#94a3b8">○</span> prod</div>
        </div>
        <p class="f">Drag to promote · AO receipts logged per deploy.</p>`)
  }
}
