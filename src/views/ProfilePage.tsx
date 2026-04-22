import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import { Button } from "components/atoms/Button"
import { VoteBlockArrowDown, VoteBlockArrowUp } from "components/atoms/VoteBlockArrows"
import ContributionGraph from "components/molecules/ContributionGraph/ContributionGraph"
import { ConnectWalletButton } from "components/molecules/ConnectWalletButton"
import { abbreviateWalletAddress } from "helpers/abbrev-wallet"
import {
  INITIAL_ACTIVITY_FEED,
  type GlobalFeedItem,
} from "helpers/activity-feed-mock-data"
import { activityDetailPath } from "helpers/app-route-name"
import { formatCount } from "helpers/format-count"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"
import { buildContributionData } from "helpers/profile-contribution-data"
import {
  buildProfileHeaderForHandle,
  buildViewerProfileHeader,
  computeProfileStats,
  mockAuthorExcerpts,
  mockFeedIdsForHandle,
  MOCK_PROFILE_COMMENTS,
  MOCK_PROFILE_CREATED,
  MOCK_PROFILE_DOWNVOTE_IDS,
  MOCK_PROFILE_REMIXES,
  MOCK_PROFILE_UPVOTE_IDS,
  type MockProfileCreatedRow,
  type ProfileHeader,
  type ProfileMockActivityEntry,
} from "helpers/profile-mock-data"
import { useArweaveProvider } from "providers/ArweaveProvider"
import { useProjects } from "providers/ProjectsProvider"
import { useViewerActivity } from "providers/ViewerActivityProvider"

import * as FeedS from "views/ActivityFeed/styles"
import * as S from "views/ProfilePage/styles"

type TabKey = "apps" | "votes" | "comments"
type AppsFilter = "all" | "apps" | "remixes"
type VotesFilter = "all" | "upvoted" | "downvoted"

/** Unified row shape — renders differently per `kind` but shares thumb/title. */
type AppsRow =
  | {
      kind: "app"
      id: string
      title: string
      at: number
      score: number
      accent: string | undefined
      subtitle: string | undefined
    }
  | {
      kind: "remix"
      id: string
      title: string
      at: number
      excerpt: string
      accent: string | undefined
    }

type VotesRow = {
  kind: "upvote" | "downvote"
  id: string
  title: string
  at: number
  builder: string | undefined
  accent: string | undefined
}

type CommentsRow = {
  kind: "comment"
  id: string
  title: string
  at: number
  excerpt: string
  accent: string | undefined
}

function formatJoinDate(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    year: "numeric",
  })
}

function thumbStyleForAccent(accent: string | undefined): React.CSSProperties {
  const base = accent ?? "oklch(0.88 0.05 90)"
  return {
    background: `linear-gradient(135deg, ${base}, color-mix(in oklab, var(--card) 82%, transparent))`,
  }
}

export default function ProfilePage() {
  const { author } = useParams<{ author?: string }>()
  const { walletAddress } = useArweaveProvider()
  const { ouroFeedItems } = useProjects()
  const { feedVotes, commentActivity, remixActivity } = useViewerActivity()

  const [tab, setTab] = useState<TabKey>("apps")
  const [appsFilter, setAppsFilter] = useState<AppsFilter>("all")
  const [votesFilter, setVotesFilter] = useState<VotesFilter>("all")

  const authorHandle = author
    ? (() => {
        try {
          return decodeURIComponent(author)
        } catch {
          return author
        }
      })()
    : null

  const isViewer = authorHandle == null

  const feedList = useMemo<GlobalFeedItem[]>(
    () => [...ouroFeedItems, ...INITIAL_ACTIVITY_FEED],
    [ouroFeedItems],
  )

  const feedIndex = useMemo(() => {
    const map = new Map<string, GlobalFeedItem>()
    for (const item of feedList) map.set(item.id, item)
    return map
  }, [feedList])

  const feedIdPool = useMemo(() => feedList.map((it) => it.id), [feedList])

  const upvotedIds = useMemo(
    () =>
      Object.entries(feedVotes)
        .filter(([, v]) => v === "up")
        .map(([id]) => id),
    [feedVotes],
  )

  const downvotedIds = useMemo(
    () =>
      Object.entries(feedVotes)
        .filter(([, v]) => v === "down")
        .map(([id]) => id),
    [feedVotes],
  )

  const header: ProfileHeader = useMemo(() => {
    if (authorHandle) return buildProfileHeaderForHandle(authorHandle)
    return buildViewerProfileHeader(walletAddress ?? null)
  }, [authorHandle, walletAddress])

  const tabData = useMemo(() => {
    if (isViewer) {
      const created: MockProfileCreatedRow[] =
        ouroFeedItems.length > 0
          ? ouroFeedItems.map((item) => ({
              id: item.id,
              title: item.cardTitle ?? item.appName,
            }))
          : MOCK_PROFILE_CREATED
      const upvoted = upvotedIds.length > 0 ? upvotedIds : MOCK_PROFILE_UPVOTE_IDS
      const downvoted =
        downvotedIds.length > 0 ? downvotedIds : MOCK_PROFILE_DOWNVOTE_IDS
      const remixed = remixActivity.length > 0 ? remixActivity : MOCK_PROFILE_REMIXES
      const comments =
        commentActivity.length > 0 ? commentActivity : MOCK_PROFILE_COMMENTS
      return { created, upvoted, downvoted, remixed, comments }
    }

    const handle = authorHandle!

    const authorCreatedFeed = feedList
      .filter((it) => it.builder === handle)
      .sort((a, b) => b.createdAt - a.createdAt)
    const authorCreated: MockProfileCreatedRow[] = authorCreatedFeed.map((it) => ({
      id: it.id,
      title: it.cardTitle ?? it.appName,
    }))

    const createdIdSet = new Set(authorCreated.map((r) => r.id))
    const externalIdPool = feedIdPool.filter((id) => !createdIdSet.has(id))

    const authorComments: ProfileMockActivityEntry[] = []
    for (const item of feedList) {
      for (const c of item.initialComments) {
        if (c.author === handle) {
          authorComments.push({
            postId: item.id,
            at: c.createdAt,
            excerpt: c.body,
          })
        }
      }
    }
    authorComments.sort((a, b) => b.at - a.at)

    return {
      created: authorCreated,
      upvoted: mockFeedIdsForHandle(handle, "upvoted", externalIdPool, 6),
      downvoted: mockFeedIdsForHandle(handle, "downvoted", externalIdPool, 2),
      remixed: mockAuthorExcerpts(handle, externalIdPool, "remix", 4),
      comments:
        authorComments.length > 0
          ? authorComments
          : mockAuthorExcerpts(handle, feedIdPool, "comment", 3),
    }
  }, [
    isViewer,
    authorHandle,
    ouroFeedItems,
    upvotedIds,
    downvotedIds,
    remixActivity,
    commentActivity,
    feedList,
    feedIdPool,
  ])

  const stats = useMemo(() => {
    if (isViewer) {
      return computeProfileStats(null, feedList, {
        apps: tabData.created.length,
        upvotesReceived: 0,
        comments: tabData.comments.length,
      })
    }
    return computeProfileStats(authorHandle, feedList)
  }, [isViewer, authorHandle, feedList, tabData.created.length, tabData.comments.length])

  const contributionData = useMemo(() => {
    if (isViewer) {
      return buildContributionData({
        handle: null,
        feed: feedList,
        viewerActivity: {
          feedVotes,
          commentActivity,
          remixActivity,
          ouroFeedItems,
        },
      })
    }
    return buildContributionData({ handle: authorHandle, feed: feedList })
  }, [
    isViewer,
    authorHandle,
    feedList,
    feedVotes,
    commentActivity,
    remixActivity,
    ouroFeedItems,
  ])

  const appsTabCount = tabData.created.length + tabData.remixed.length
  const votesTabCount = tabData.upvoted.length + tabData.downvoted.length

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "apps", label: "Apps", count: appsTabCount },
    { key: "votes", label: "Votes", count: votesTabCount },
    { key: "comments", label: "Comments", count: tabData.comments.length },
  ]

  /** Unified rows for the Apps tab: created apps + posted remix ideas. */
  const appsRows: AppsRow[] = useMemo(() => {
    const apps: AppsRow[] = tabData.created.map((row) => {
      const it = feedIndex.get(row.id)
      return {
        kind: "app" as const,
        id: row.id,
        title: row.title,
        at: it?.createdAt ?? 0,
        score: it?.score ?? 0,
        accent: it?.previewHoverAccent,
        subtitle: it?.appName,
      }
    })
    const remixes: AppsRow[] = tabData.remixed.map((entry) => {
      const it = feedIndex.get(entry.postId)
      return {
        kind: "remix" as const,
        id: entry.postId,
        title: it?.cardTitle ?? it?.appName ?? entry.postId,
        at: entry.at,
        excerpt: entry.excerpt,
        accent: it?.previewHoverAccent,
      }
    })
    const filtered =
      appsFilter === "apps" ? apps : appsFilter === "remixes" ? remixes : [...apps, ...remixes]
    return filtered.sort((a, b) => b.at - a.at)
  }, [tabData.created, tabData.remixed, feedIndex, appsFilter])

  /** Unified rows for the Votes tab: upvoted + downvoted listings. */
  const votesRows: VotesRow[] = useMemo(() => {
    const mk = (id: string, kind: "upvote" | "downvote"): VotesRow => {
      const it = feedIndex.get(id)
      return {
        kind,
        id,
        title: it?.cardTitle ?? it?.appName ?? id,
        at: it?.createdAt ?? 0,
        builder: it?.builder,
        accent: it?.previewHoverAccent,
      }
    }
    const ups = tabData.upvoted.map((id) => mk(id, "upvote"))
    const downs = tabData.downvoted.map((id) => mk(id, "downvote"))
    const filtered =
      votesFilter === "upvoted" ? ups : votesFilter === "downvoted" ? downs : [...ups, ...downs]
    return filtered.sort((a, b) => b.at - a.at)
  }, [tabData.upvoted, tabData.downvoted, feedIndex, votesFilter])

  const commentsRows: CommentsRow[] = useMemo(() => {
    return tabData.comments.map((entry) => {
      const it = feedIndex.get(entry.postId)
      return {
        kind: "comment" as const,
        id: entry.postId,
        title: it?.cardTitle ?? it?.appName ?? entry.postId,
        at: entry.at,
        excerpt: entry.excerpt,
        accent: it?.previewHoverAccent,
      }
    })
  }, [tabData.comments, feedIndex])

  const appsFilterOptions: { key: AppsFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: tabData.created.length + tabData.remixed.length },
    { key: "apps", label: "Apps", count: tabData.created.length },
    { key: "remixes", label: "Remixes", count: tabData.remixed.length },
  ]

  const votesFilterOptions: { key: VotesFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: tabData.upvoted.length + tabData.downvoted.length },
    { key: "upvoted", label: "Upvoted", count: tabData.upvoted.length },
    { key: "downvoted", label: "Downvoted", count: tabData.downvoted.length },
  ]

  return (
    <FeedS.Page>
      <FeedS.StickyHeader>
        <FeedS.HeaderInner>
          <FeedS.HeaderBrandWrap>
            <FeedS.HeaderBrandLink to="/">PermawebOS</FeedS.HeaderBrandLink>
          </FeedS.HeaderBrandWrap>
          <FeedS.HeaderActions>
            <ConnectWalletButton />
          </FeedS.HeaderActions>
        </FeedS.HeaderInner>
      </FeedS.StickyHeader>

      <FeedS.FeedMain>
        <S.ProfileStack>
          <S.ProfileHeroCard>
            <S.ProfileHeroBody>
              <S.ProfileAvatar $hue={header.accentHue} aria-hidden>
                {header.initials}
              </S.ProfileAvatar>
              <S.ProfileHeroHeadline>
                <S.ProfileNameRow>
                  <S.ProfileName>{header.displayName}</S.ProfileName>
                  {header.verified ? (
                    <S.VerifiedDot aria-label="Verified builder" role="img" />
                  ) : null}
                </S.ProfileNameRow>
                {!isViewer ? (
                  <S.ProfileActions>
                    <Button type="button" variant="accent" size="sm">
                      Follow
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      Share
                    </Button>
                  </S.ProfileActions>
                ) : null}
              </S.ProfileHeroHeadline>
              <S.ProfileIdentity>
                <S.ProfileHandle title={header.wallet}>
                  {abbreviateWalletAddress(header.wallet)}
                </S.ProfileHandle>
                <S.ProfileBio>{header.bio}</S.ProfileBio>
                <S.ProfileFollowRow>
                  <S.ProfileFollowItem>
                    <S.ProfileFollowValue>
                      {formatCount(stats.following)}
                    </S.ProfileFollowValue>
                    Following
                  </S.ProfileFollowItem>
                  <S.ProfileFollowItem>
                    <S.ProfileFollowValue>
                      {formatCount(stats.followers)}
                    </S.ProfileFollowValue>
                    Followers
                  </S.ProfileFollowItem>
                  <S.ProfileJoinedItem>
                    Joined {formatJoinDate(header.joinedAt)}
                  </S.ProfileJoinedItem>
                </S.ProfileFollowRow>
              </S.ProfileIdentity>
            </S.ProfileHeroBody>
          </S.ProfileHeroCard>

          <ContributionGraph data={contributionData} />

          <S.TabNav role="tablist" aria-label="Profile sections">
            {tabs.map((t) => (
              <S.TabButton
                key={t.key}
                role="tab"
                type="button"
                aria-selected={tab === t.key}
                $active={tab === t.key}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                <S.TabCount>{t.count}</S.TabCount>
              </S.TabButton>
            ))}
          </S.TabNav>

          {tab === "apps" ? (
            <>
              <SubFilter
                options={appsFilterOptions}
                value={appsFilter}
                onChange={setAppsFilter}
                label="Filter apps"
              />
              <AppsPanel
                rows={appsRows}
                emptyLabel={
                  appsFilter === "remixes"
                    ? "No remix ideas posted yet."
                    : appsFilter === "apps"
                      ? isViewer
                        ? "You haven't published an app yet."
                        : "No apps yet."
                      : "Nothing here yet."
                }
              />
            </>
          ) : null}

          {tab === "votes" ? (
            <>
              <SubFilter
                options={votesFilterOptions}
                value={votesFilter}
                onChange={setVotesFilter}
                label="Filter votes"
              />
              <VotesPanel
                rows={votesRows}
                emptyLabel={
                  votesFilter === "upvoted"
                    ? "No upvotes yet."
                    : votesFilter === "downvoted"
                      ? "No downvotes yet."
                      : "No votes yet."
                }
              />
            </>
          ) : null}

          {tab === "comments" ? (
            <CommentsPanel rows={commentsRows} emptyLabel="No comments yet." />
          ) : null}
        </S.ProfileStack>
      </FeedS.FeedMain>
    </FeedS.Page>
  )
}

function SubFilter<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { key: T; label: string; count: number }[]
  value: T
  onChange: (next: T) => void
  label: string
}) {
  return (
    <S.SubFilterBar role="tablist" aria-label={label}>
      {options.map((opt) => (
        <S.SubFilterPill
          key={opt.key}
          role="tab"
          type="button"
          aria-selected={value === opt.key}
          $active={value === opt.key}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
          <S.SubFilterCount>{opt.count}</S.SubFilterCount>
        </S.SubFilterPill>
      ))}
    </S.SubFilterBar>
  )
}

function AppsPanel({
  rows,
  emptyLabel,
}: {
  rows: AppsRow[]
  emptyLabel: string
}) {
  if (rows.length === 0) return <S.EmptyPanel>{emptyLabel}</S.EmptyPanel>
  return (
    <S.ItemList>
      {rows.map((row) => (
        <S.ItemRow
          key={`${row.kind}-${row.id}-${row.at}`}
          to={activityDetailPath(row.id)}
        >
          <S.ItemThumb style={thumbStyleForAccent(row.accent)} />
          <S.ItemBody>
            <S.ItemTitle>{row.title}</S.ItemTitle>
            {row.kind === "app" ? (
              <S.ItemMeta>
                {row.subtitle ? `${row.subtitle} · ` : ""}
                {formatShortTimeAgo(row.at)}
              </S.ItemMeta>
            ) : (
              <S.ItemExcerpt>{row.excerpt}</S.ItemExcerpt>
            )}
          </S.ItemBody>
          <S.ItemTrailing>
            {row.kind === "app"
              ? formatCount(row.score)
              : formatShortTimeAgo(row.at)}
          </S.ItemTrailing>
        </S.ItemRow>
      ))}
    </S.ItemList>
  )
}

function VotesPanel({
  rows,
  emptyLabel,
}: {
  rows: VotesRow[]
  emptyLabel: string
}) {
  if (rows.length === 0) return <S.EmptyPanel>{emptyLabel}</S.EmptyPanel>
  return (
    <S.ItemList>
      {rows.map((row) => (
        <S.ItemRow
          key={`${row.kind}-${row.id}`}
          to={activityDetailPath(row.id)}
        >
          <S.ItemThumb style={thumbStyleForAccent(row.accent)} />
          <S.ItemBody>
            <S.ItemTitle>{row.title}</S.ItemTitle>
            {row.builder ? (
              <S.ItemMeta>
                {row.builder} · {formatShortTimeAgo(row.at)}
              </S.ItemMeta>
            ) : null}
          </S.ItemBody>
          <S.ItemTrailing>
            <S.VoteArrowBadge
              $dir={row.kind === "upvote" ? "up" : "down"}
              aria-label={row.kind === "upvote" ? "Upvoted" : "Downvoted"}
            >
              {row.kind === "upvote" ? (
                <VoteBlockArrowUp filled />
              ) : (
                <VoteBlockArrowDown filled />
              )}
            </S.VoteArrowBadge>
          </S.ItemTrailing>
        </S.ItemRow>
      ))}
    </S.ItemList>
  )
}

function CommentsPanel({
  rows,
  emptyLabel,
}: {
  rows: CommentsRow[]
  emptyLabel: string
}) {
  if (rows.length === 0) return <S.EmptyPanel>{emptyLabel}</S.EmptyPanel>
  return (
    <S.ItemList>
      {rows.map((row, i) => (
        <S.ItemRow
          key={`${row.id}-${row.at}-${i}`}
          to={activityDetailPath(row.id)}
        >
          <S.ItemThumb style={thumbStyleForAccent(row.accent)} />
          <S.ItemBody>
            <S.ItemTitle>{row.title}</S.ItemTitle>
            <S.ItemExcerpt>{row.excerpt}</S.ItemExcerpt>
          </S.ItemBody>
          <S.ItemTrailing>{formatShortTimeAgo(row.at)}</S.ItemTrailing>
        </S.ItemRow>
      ))}
    </S.ItemList>
  )
}
