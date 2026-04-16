import { useMemo, useState, type FormEvent } from "react"
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  Clock,
  Copy,
  ImageIcon,
  Link2,
  MessageSquare,
  ShuffleIcon,
} from "lucide-react"
import { Navigate, useParams } from "react-router-dom"

import { FeedPriceCaption } from "components/atoms/FeedPriceCaption"
import {
  StatRowIconLabel,
  StatRowList,
  StatRowValue,
} from "components/molecules/StatRow"
import { VoteBlockArrowDown, VoteBlockArrowUp } from "components/atoms/VoteBlockArrows"

import { studioPathForProtocol } from "helpers/app-route-name"
import {
  INITIAL_ACTIVITY_FEED,
  mockRemixListForItem,
  type FeedComment,
} from "helpers/activity-feed-mock-data"
import { abbreviateWalletAddress } from "helpers/abbrev-wallet"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"

import * as S from "./styles"

type ViewerVote = "up" | "down" | null

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return `${n}`
}

function newCommentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `detail-${crypto.randomUUID().slice(0, 8)}`
  }
  return `detail-${Date.now()}`
}

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

function abbreviateMiddle(s: string, front = 8, back = 4): string {
  const t = s.trim()
  if (t.length <= front + back + 1) return t
  return `${t.slice(0, front)}…${t.slice(-back)}`
}

function scoreTone(score: number): "positive" | "negative" | "neutral" {
  if (score > 0) return "positive"
  if (score < 0) return "negative"
  return "neutral"
}

export function AppDetailPage() {
  const { feedId = "" } = useParams<{ feedId: string }>()
  const decodedId = decodeURIComponent(feedId)
  const item = INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId) ?? null

  const [vote, setVote] = useState<ViewerVote>(null)
  const [comments, setComments] = useState<FeedComment[]>(
    () =>
      INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId)?.initialComments ??
      []
  )
  const [draft, setDraft] = useState("")

  const remixes = useMemo(() => {
    const found = INITIAL_ACTIVITY_FEED.find((x) => x.id === decodedId)
    if (!found) return []
    return mockRemixListForItem(found)
  }, [decodedId])

  const [detailTab, setDetailTab] = useState<
    "comments" | "holders" | "activity" | "details"
  >("comments")

  const holderRows = useMemo(() => {
    if (!item) {
      return []
    }
    const h = hashSeed(item.id)
    const names = [
      "Market",
      "thepark (creator)",
      "0x5dad…46e8",
      "0x9a3c…e210",
      "isaac",
      "moneybots",
    ]
    const pcts = [97.793, 1.792, 0.259, 0.089, 0.042, 0.025 + (h % 10) / 10000]
    const badges: ("green" | "blue" | "muted")[] = [
      "green",
      "blue",
      "muted",
      "muted",
      "muted",
      "muted",
    ]
    return names.map((name, i) => ({
      rank: i + 1,
      name,
      pct: pcts[i] ?? 0.01,
      badge: badges[i] ?? "muted",
    }))
  }, [item])

  const activityRows = useMemo(
    () => [
      { who: "isaac", qty: "151k", price: "$0.13", ago: "8d" },
      { who: "moneybots", qty: "488k", price: "$0.72", ago: "17d" },
      { who: "0x5dad…46e8", qty: "2.6m", price: "$2.07", ago: "28d" },
      { who: "ninaalvarez", qty: "7.9m", price: "$4.12", ago: "1mo" },
    ],
    []
  )

  if (!item) {
    return <Navigate to="/" replace />
  }

  const displayScore =
    item.score + (vote === "up" ? 1 : vote === "down" ? -1 : 0)
  const title = item.cardTitle ?? item.appName
  const remixListCount = remixes.length

  function toggleVote(direction: "up" | "down") {
    setVote((cur) => (cur === direction ? null : direction))
  }

  function submitComment(e: FormEvent) {
    e.preventDefault()
    const raw = draft.trim()
    if (!raw) return
    setComments((prev) => [
      ...prev,
      {
        id: newCommentId(),
        author: "you",
        authorInitials: "ME",
        body: raw,
        createdAt: Date.now(),
        viewerVote: null,
      },
    ])
    setDraft("")
  }

  return (
    <S.Page>
      <S.StickyHeader>
        <S.HeaderInner>
          <S.BackLink to="/">
            <S.BackIcon>
              <ArrowLeftIcon />
            </S.BackIcon>
            Feed
          </S.BackLink>
          <S.HeaderTitle>{title}</S.HeaderTitle>
        </S.HeaderInner>
      </S.StickyHeader>

      <S.DetailMain>
        <S.DetailGrid>
          <S.PrimaryColumn>
            <S.PreviewFrame>
              <S.PreviewIframe
                title={`${item.appName} preview`}
                srcDoc={item.previewHtml}
                sandbox="allow-scripts"
              />
            </S.PreviewFrame>

            <S.HeroMetaRow>
              <S.HeroTextCol>
                <S.TitleRow>
                  <S.TitleH1>{title}</S.TitleH1>
                  <FeedPriceCaption
                    variant="inline"
                    priceChangePct={item.priceChangePct}
                    marketCapLabel={item.marketCapLabel}
                  />
                </S.TitleRow>
                <S.SubMetaLine>
                  <S.SubMetaNums title={item.builderWallet}>
                    {abbreviateWalletAddress(item.builderWallet)}
                  </S.SubMetaNums>{" "}
                  · {formatShortTimeAgo(item.createdAt)} · {item.transactionId}
                </S.SubMetaLine>
              </S.HeroTextCol>
              <S.HeroActions>
                <S.DetailRemixJumpButton
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<a href="#remixes" />}
                  title={`${remixListCount} remixes — jump to list`}
                  aria-label={`${remixListCount} remixes, skip to remix list`}
                >
                  <S.Icon16>
                    <ShuffleIcon strokeWidth={1} aria-hidden />
                  </S.Icon16>
                  <S.TabularText>
                    {remixListCount > 99 ? "99+" : remixListCount}
                  </S.TabularText>
                </S.DetailRemixJumpButton>
                <S.VoteGroup role="group" aria-label="Vote on this listing">
                  <S.VoteIconBtn
                    type="button"
                    aria-label="Upvote"
                    aria-pressed={vote === "up"}
                    $active={vote === "up"}
                    $tone="up"
                    onClick={() => toggleVote("up")}
                  >
                    <S.VoteArrowWrap>
                      <VoteBlockArrowUp filled={vote === "up"} />
                    </S.VoteArrowWrap>
                  </S.VoteIconBtn>
                  <S.ScoreValue $tone={scoreTone(displayScore)} title="Score">
                    {formatCount(displayScore)}
                  </S.ScoreValue>
                  <S.VoteIconBtn
                    type="button"
                    aria-label="Downvote"
                    aria-pressed={vote === "down"}
                    $active={vote === "down"}
                    $tone="down"
                    onClick={() => toggleVote("down")}
                  >
                    <S.VoteArrowWrap>
                      <VoteBlockArrowDown filled={vote === "down"} />
                    </S.VoteArrowWrap>
                  </S.VoteIconBtn>
                </S.VoteGroup>
              </S.HeroActions>
            </S.HeroMetaRow>

            <S.DetailTabs
              value={detailTab}
              onValueChange={(v) =>
                setDetailTab(v as "comments" | "holders" | "activity" | "details")
              }
            >
              <S.DetailTabsList variant="line">
                <S.DetailTabsTrigger value="comments">
                  Comments
                </S.DetailTabsTrigger>
                <S.DetailTabsTrigger value="holders">Holders</S.DetailTabsTrigger>
                <S.DetailTabsTrigger value="activity">Activity</S.DetailTabsTrigger>
                <S.DetailTabsTrigger value="details">Details</S.DetailTabsTrigger>
              </S.DetailTabsList>

              <S.TabsPanelComments value="comments">
                <form onSubmit={submitComment}>
                  <label htmlFor="detail-comment" className="sr-only">
                    Add comment
                  </label>
                  <S.CommentComposerShell>
                    <S.CommentComposerTextarea
                      id="detail-comment"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={3}
                      placeholder="Add a comment…"
                    />
                    <S.PostCommentFab
                      type="submit"
                      disabled={!draft.trim()}
                      aria-label="Post comment"
                      title="Post comment"
                    >
                      <S.PostCommentFabIcon>
                        <ArrowUpIcon strokeWidth={2.25} aria-hidden />
                      </S.PostCommentFabIcon>
                    </S.PostCommentFab>
                  </S.CommentComposerShell>
                </form>

                {comments.length === 0 ? (
                  <S.EmptyComments>
                    <S.EmptyCommentsIcon>
                      <MessageSquare strokeWidth={1} aria-hidden />
                    </S.EmptyCommentsIcon>
                    <S.EmptyCommentsTitle>No comments yet</S.EmptyCommentsTitle>
                    <S.EmptyCommentsHint>
                      Be the first to add a comment
                    </S.EmptyCommentsHint>
                  </S.EmptyComments>
                ) : (
                  <S.CommentsStatRowList>
                    {comments.map((c) => (
                      <S.CommentStatRow key={c.id}>
                        <S.CommentAvatar>
                          <S.CommentAvatarFallback>
                            {c.authorInitials}
                          </S.CommentAvatarFallback>
                        </S.CommentAvatar>
                        <S.CommentBlock>
                          <S.CommentMeta>
                            <S.CommentAuthor>{c.author}</S.CommentAuthor> ·{" "}
                            {formatShortTimeAgo(c.createdAt)}
                          </S.CommentMeta>
                          <S.CommentBody>{c.body}</S.CommentBody>
                        </S.CommentBlock>
                      </S.CommentStatRow>
                    ))}
                  </S.CommentsStatRowList>
                )}
              </S.TabsPanelComments>

              <S.TabsPanelPlain value="holders">
                <StatRowList as="ul">
                  {holderRows.map((row, i) => (
                    <S.HolderStatRow key={row.rank} striped={i % 2 === 1}>
                      <S.HolderRank>{row.rank}</S.HolderRank>
                      <S.HolderAvatar>
                        <S.HolderAvatarFallback>
                          {row.name.slice(0, 2).toUpperCase()}
                        </S.HolderAvatarFallback>
                      </S.HolderAvatar>
                      <S.HolderName>{row.name}</S.HolderName>
                      <S.HolderBadge $tone={row.badge}>
                        {row.pct.toFixed(3)}%
                      </S.HolderBadge>
                    </S.HolderStatRow>
                  ))}
                </StatRowList>
              </S.TabsPanelPlain>

              <S.TabsPanelPlain value="activity">
                <StatRowList as="ul">
                  {activityRows.map((row, i) => (
                    <S.ActivityStatRow key={`${row.who}-${i}`} striped={i % 2 === 1}>
                      <S.ActivityWhoCell>
                        <S.ActivityAvatar>
                          <S.ActivityAvatarFallback>
                            {row.who.slice(0, 2).toUpperCase()}
                          </S.ActivityAvatarFallback>
                        </S.ActivityAvatar>
                        <S.ActivityWho>{row.who}</S.ActivityWho>
                      </S.ActivityWhoCell>
                      <S.ActivityBuy>Buy</S.ActivityBuy>
                      <S.ActivityQty>{row.qty}</S.ActivityQty>
                      <S.ActivityPrice>{row.price}</S.ActivityPrice>
                      <S.ActivityAgo>{row.ago}</S.ActivityAgo>
                    </S.ActivityStatRow>
                  ))}
                </StatRowList>
              </S.TabsPanelPlain>

              <S.TabsPanelPlain value="details">
                <StatRowList>
                  {(
                    [
                      {
                        Icon: Clock,
                        label: "Created",
                        value: new Date(item.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }),
                      },
                      {
                        Icon: Link2,
                        label: "Contract address",
                        value: (
                          <S.ContractValueRow>
                            {abbreviateMiddle(item.transactionId, 10, 4)}
                            <S.CopyIconButton
                              type="button"
                              aria-label="Copy contract address"
                              onClick={() =>
                                void navigator.clipboard?.writeText(item.transactionId)
                              }
                            >
                              <S.CopyIcon>
                                <Copy strokeWidth={1.5} />
                              </S.CopyIcon>
                            </S.CopyIconButton>
                          </S.ContractValueRow>
                        ),
                      },
                      {
                        Icon: Link2,
                        label: "Chain",
                        value: "Arweave",
                      },
                      {
                        Icon: Link2,
                        label: "Pair",
                        value: item.appName,
                      },
                      {
                        Icon: Link2,
                        label: "Fee",
                        value: "1%",
                      },
                      {
                        Icon: ImageIcon,
                        label: "Media",
                        value: "PNG",
                      },
                    ] as const
                  ).map((row, i) => (
                    <S.DetailsStatRow key={row.label} striped={i % 2 === 1}>
                      <StatRowIconLabel icon={row.Icon}>
                        {row.label}
                      </StatRowIconLabel>
                      <StatRowValue>{row.value}</StatRowValue>
                    </S.DetailsStatRow>
                  ))}
                </StatRowList>
              </S.TabsPanelPlain>
            </S.DetailTabs>
          </S.PrimaryColumn>

          <S.RemixAside id="remixes">
            <S.RemixAsideTitle>Remixes</S.RemixAsideTitle>
            <S.RemixAsideList>
              {remixes.map((r) => (
                <li key={r.id}>
                  <S.RemixCardLink to={studioPathForProtocol(item.appName)}>
                    <S.RemixThumb>
                      <S.RemixThumbIframe
                        title={`Preview: ${r.title}`}
                        srcDoc={r.previewHtml}
                        sandbox="allow-scripts"
                      />
                    </S.RemixThumb>
                    <S.RemixCardBody>
                      <S.RemixCardTitle>{r.title}</S.RemixCardTitle>
                      <S.RemixCardMeta>
                        <S.RemixCardAuthor>{r.author}</S.RemixCardAuthor>
                        <span aria-hidden> · </span>
                        {formatShortTimeAgo(r.createdAt)}
                      </S.RemixCardMeta>
                      <S.RemixCardVotes>
                        {formatCount(r.score)} votes
                      </S.RemixCardVotes>
                    </S.RemixCardBody>
                  </S.RemixCardLink>
                </li>
              ))}
            </S.RemixAsideList>
          </S.RemixAside>
        </S.DetailGrid>
      </S.DetailMain>
    </S.Page>
  )
}

export default AppDetailPage
