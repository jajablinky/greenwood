import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import * as S from "./styles"

const AVATAR_BG_DEEP = [
  "var(--color-permaweb-red-1-deep)",
  "var(--color-permaweb-red-2-smooth)",
  "var(--color-permaweb-green-1-deep)",
  "var(--color-permaweb-green-2-lime)",
  "var(--color-permaweb-blue-1-deep)",
  "var(--color-permaweb-blue-2-lavender)",
  "var(--color-permaweb-violet-deep)",
  "var(--color-permaweb-amber-deep)",
  "var(--color-permaweb-cyan-deep)",
  "var(--color-permaweb-rose-deep)",
  "var(--color-alt-red-deep)",
  "var(--color-alt-red-smooth)",
  "var(--color-alt-green-deep)",
  "var(--color-alt-green-lime)",
  "var(--color-alt-blue-deep)",
  "var(--color-alt-blue-lavender)",
] as const

const AVATAR_BG_SOFT = [
  "var(--color-permaweb-red-3-salmon)",
  "var(--color-permaweb-red-4-light)",
  "var(--color-permaweb-green-3-mint)",
  "var(--color-permaweb-green-4-light)",
  "var(--color-permaweb-blue-3-baby)",
  "var(--color-permaweb-blue-4-light)",
  "var(--color-permaweb-violet-soft)",
  "var(--color-permaweb-amber-soft)",
  "var(--color-permaweb-cyan-soft)",
  "var(--color-permaweb-rose-soft)",
  "var(--color-alt-red-salmon)",
  "var(--color-alt-red-light)",
  "var(--color-alt-green-mint)",
  "var(--color-alt-green-light)",
  "var(--color-alt-blue-baby)",
  "var(--color-alt-blue-light)",
] as const

const AVATAR_SOFT_WEIGHT = 3

function hashSeed(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return h >>> 0
}

function permawebAvatarBackground(seed: string): string {
  const h = hashSeed(seed)
  const pickSoft = h % 100 < AVATAR_SOFT_WEIGHT
  const spread = Math.imul(h, 0x9e37_79b1) >>> 0
  if (pickSoft) {
    return AVATAR_BG_SOFT[spread % AVATAR_BG_SOFT.length]
  }
  return AVATAR_BG_DEEP[spread % AVATAR_BG_DEEP.length]
}

function PermawebHumanFigurine() {
  return (
    <S.FigurineSvg
      viewBox="0 0 89.6051 173"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <g fill="currentColor">
        <circle
          cx="44.6856"
          cy="14.7554"
          r="14.7554"
          transform="rotate(180 44.6856 14.7554)"
        />
        <path d="M61.429 83.776L61.429 69.4365L75.2315 94.7838C77.3584 98.6897 82.0689 100.028 85.7528 97.7729C89.4367 95.5178 90.6988 90.5234 88.572 86.6175L61.5046 36.9102C59.9539 34.0625 57.0298 32.5797 54.1316 32.8592L35.4737 32.8592C32.5754 32.5796 29.6513 34.0625 28.1006 36.9102L1.03317 86.6175C-1.09371 90.5234 0.168479 95.5178 3.85235 97.7728C7.53622 100.028 12.2468 98.6896 14.3736 94.7838L28.1481 69.4879L28.1481 83.776L28.1481 100.915L28.1481 164.431C28.1481 169.163 30.8796 173 35.3434 173C39.8073 173 43.4259 169.163 43.4259 164.431L43.4259 101.412C43.5839 101.417 45.5167 101.419 45.6757 101.419C45.8347 101.419 45.9932 101.417 46.1511 101.412L46.1511 164.431C46.1511 169.163 49.7698 173 54.2336 173C58.6975 173 61.429 169.163 61.429 164.431L61.429 101.419V100.915L61.429 83.776Z" />
      </g>
    </S.FigurineSvg>
  )
}

function textFromNode(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") {
    return ""
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(textFromNode).join("")
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode }
    return textFromNode(props.children)
  }
  return ""
}

function twoLetterAbbreviation(node: React.ReactNode): string {
  const raw = textFromNode(node).trim()
  const letters = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
  if (letters.length >= 2) {
    return letters.slice(0, 2)
  }
  if (letters.length === 1) {
    return letters + letters
  }
  const any = raw.replace(/\s/g, "").toUpperCase()
  if (any.length >= 2) {
    return any.slice(0, 2)
  }
  if (any.length === 1) {
    return any + any
  }
  return "??"
}

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <S.Root data-slot="avatar" data-size={size} className={className} {...props} />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return <S.Image data-slot="avatar-image" className={className} {...props} />
}

function AvatarFallback({
  className,
  children,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  const abbr = twoLetterAbbreviation(children)
  const bg = permawebAvatarBackground(abbr)
  return (
    <S.Fallback
      data-slot="avatar-fallback"
      className={className}
      $background={bg}
      {...props}
    >
      <S.FigurineWrap>
        <PermawebHumanFigurine />
      </S.FigurineWrap>
      <S.Abbr data-slot="avatar-abbr">{abbr}</S.Abbr>
    </S.Fallback>
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return <S.Badge data-slot="avatar-badge" className={className} {...props} />
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <S.Group data-slot="avatar-group" className={className} {...props} />
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <S.GroupCount data-slot="avatar-group-count" className={className} {...props} />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
