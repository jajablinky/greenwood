import type { FeedComment } from "helpers/activity-feed-mock-data"

export type CommentTreeNode = FeedComment & { children: CommentTreeNode[] }

/** Flat list with `parentId` → nested tree (roots only; children linked). */
export function buildCommentTree(flat: FeedComment[]): CommentTreeNode[] {
  const map = new Map<string, CommentTreeNode>()
  for (const c of flat) {
    map.set(c.id, { ...c, children: [] })
  }
  const roots: CommentTreeNode[] = []
  for (const c of flat) {
    const node = map.get(c.id)!
    if (c.parentId) {
      const p = map.get(c.parentId)
      if (p) p.children.push(node)
      else roots.push(node)
    } else {
      roots.push(node)
    }
  }
  const sortByTime = (a: CommentTreeNode, b: CommentTreeNode) =>
    a.createdAt - b.createdAt
  roots.sort(sortByTime)
  function sortChildren(n: CommentTreeNode) {
    n.children.sort(sortByTime)
    n.children.forEach(sortChildren)
  }
  roots.forEach(sortChildren)
  return roots
}

/** Display score: mock base `score` plus the viewer’s vote. */
export function commentDisplayScore(
  c: Pick<FeedComment, "score" | "viewerVote">,
): number {
  const d =
    c.viewerVote === "up" ? 1 : c.viewerVote === "down" ? -1 : 0
  return c.score + d
}

export const FEED_COMMENT_TOP_N = 5

/** Roots only: hottest first (score, then recency). */
export function sortCommentRootsByHot(roots: CommentTreeNode[]): CommentTreeNode[] {
  return [...roots].sort((a, b) => {
    const sa = commentDisplayScore(a)
    const sb = commentDisplayScore(b)
    if (sb !== sa) return sb - sa
    return b.createdAt - a.createdAt
  })
}

export function scoreToneForComment(
  score: number,
): "positive" | "negative" | "neutral" {
  if (score > 0) return "positive"
  if (score < 0) return "negative"
  return "neutral"
}
