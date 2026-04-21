import { useMemo } from "react"
import { useParams } from "react-router-dom"

import { ConnectWalletButton } from "components/molecules/ConnectWalletButton"
import { abbreviateWalletAddress } from "helpers/abbrev-wallet"
import { INITIAL_ACTIVITY_FEED } from "helpers/activity-feed-mock-data"
import { activityDetailPath } from "helpers/app-route-name"
import { formatShortTimeAgo } from "helpers/format-short-time-ago"
import {
  MOCK_PROFILE_COMMENTS,
  MOCK_PROFILE_CREATED,
  MOCK_PROFILE_DOWNVOTE_IDS,
  MOCK_PROFILE_REMIXES,
  MOCK_PROFILE_UPVOTE_IDS,
} from "helpers/profile-mock-data"
import { useArweaveProvider } from "providers/ArweaveProvider"
import { useProjects } from "providers/ProjectsProvider"
import { useViewerActivity } from "providers/ViewerActivityProvider"

import * as FeedS from "views/ActivityFeed/styles"
import * as S from "views/ProfilePage/styles"

export default function ProfilePage() {
  const { author } = useParams<{ author?: string }>()
  const { walletAddress } = useArweaveProvider()
  const { ouroFeedItems } = useProjects()
  const {
    feedVotes,
    commentActivity,
    remixActivity,
  } = useViewerActivity()

  const authorHandle = author
    ? (() => {
        try {
          return decodeURIComponent(author)
        } catch {
          return author
        }
      })()
    : null

  const mergedFeedIndex = useMemo(() => {
    const map = new Map<string, string>()
    for (const item of [...ouroFeedItems, ...INITIAL_ACTIVITY_FEED]) {
      map.set(item.id, item.cardTitle ?? item.appName)
    }
    return map
  }, [ouroFeedItems])

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

  const upvoteRows = upvotedIds.length > 0 ? upvotedIds : MOCK_PROFILE_UPVOTE_IDS
  const downvoteRows = downvotedIds.length > 0 ? downvotedIds : MOCK_PROFILE_DOWNVOTE_IDS
  const createdRows =
    ouroFeedItems.length > 0
      ? ouroFeedItems.map((item) => ({
          id: item.id,
          title: item.cardTitle ?? item.appName,
        }))
      : MOCK_PROFILE_CREATED
  const remixRows = remixActivity.length > 0 ? remixActivity : MOCK_PROFILE_REMIXES
  const commentRows = commentActivity.length > 0 ? commentActivity : MOCK_PROFILE_COMMENTS

  if (authorHandle) {
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
          <p
            style={{
              margin: "0 0 0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            {authorHandle}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              color: "var(--muted-foreground)",
            }}
          >
            Builder profile (placeholder). Activity and apps for this handle will
            appear here.
          </p>
        </FeedS.FeedMain>
      </FeedS.Page>
    )
  }

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
          <div>
            <p
              style={{
                margin: "0 0 0.35rem",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              You
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.9375rem",
                color: "var(--muted-foreground)",
              }}
            >
              {walletAddress
                ? `Connected as ${abbreviateWalletAddress(walletAddress)}.`
                : "Connect a wallet to publish and manage projects."}
            </p>
          </div>

          <S.Section>
            <S.SectionTitle>Upvoted</S.SectionTitle>
            <S.RowList>
              {upvoteRows.map((id) => (
                <S.RowLink key={id} to={activityDetailPath(id)}>
                  <S.RowMain>{mergedFeedIndex.get(id) ?? id}</S.RowMain>
                </S.RowLink>
              ))}
            </S.RowList>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Downvoted</S.SectionTitle>
            <S.RowList>
              {downvoteRows.map((id) => (
                <S.RowLink key={id} to={activityDetailPath(id)}>
                  <S.RowMain>{mergedFeedIndex.get(id) ?? id}</S.RowMain>
                </S.RowLink>
              ))}
            </S.RowList>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Created</S.SectionTitle>
            <S.RowList>
              {createdRows.map((row) => (
                <S.RowLink key={row.id} to={activityDetailPath(row.id)}>
                  <S.RowMain>{row.title}</S.RowMain>
                </S.RowLink>
              ))}
            </S.RowList>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Remix ideas</S.SectionTitle>
            <S.RowList>
              {remixRows.map((entry, idx) => (
                <S.RowLink
                  key={`${entry.postId}-${entry.at}-${idx}`}
                  to={activityDetailPath(entry.postId)}
                >
                  <S.RowMain>
                    {mergedFeedIndex.get(entry.postId) ?? entry.postId}
                    <S.RowExcerpt>{entry.excerpt}</S.RowExcerpt>
                  </S.RowMain>
                  <S.RowMeta>{formatShortTimeAgo(entry.at)}</S.RowMeta>
                </S.RowLink>
              ))}
            </S.RowList>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Comments</S.SectionTitle>
            <S.RowList>
              {commentRows.map((entry, idx) => (
                <S.RowLink
                  key={`${entry.postId}-${entry.at}-${idx}`}
                  to={activityDetailPath(entry.postId)}
                >
                  <S.RowMain>
                    {mergedFeedIndex.get(entry.postId) ?? entry.postId}
                    <S.RowExcerpt>{entry.excerpt}</S.RowExcerpt>
                  </S.RowMain>
                  <S.RowMeta>{formatShortTimeAgo(entry.at)}</S.RowMeta>
                </S.RowLink>
              ))}
            </S.RowList>
          </S.Section>
        </S.ProfileStack>
      </FeedS.FeedMain>
    </FeedS.Page>
  )
}
