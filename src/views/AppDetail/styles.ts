import styled, { css } from "styled-components"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "components/ui/avatar"
import { Button } from "components/ui/button"
import { StatRow, StatRowList } from "components/molecules/StatRow"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"

const tabular = css`
  font-variant-numeric: tabular-nums;
`

export const Page = styled.div`
  min-height: 100svh;
  background: #ffffff;
  color: var(--foreground);
  .dark & {
    background: var(--background);
  }
`

export const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid rgb(0 0 0 / 6%);
  background: color-mix(in oklab, white 92%, transparent);
  backdrop-filter: blur(12px);
  .dark & {
    border-color: rgb(255 255 255 / 8%);
    background: color-mix(in oklab, var(--background) 92%, transparent);
  }
`

export const HeaderInner = styled.div`
  margin-inline: auto;
  display: flex;
  max-width: 72rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  @media (min-width: 640px) {
    padding-inline: 1.5rem;
  }
`

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--foreground);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const BackIcon = styled.span`
  display: inline-flex;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const HeaderTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--muted-foreground);
`

export const DetailMain = styled.main`
  margin-inline: auto;
  max-width: 72rem;
  padding: 1rem;
  @media (min-width: 640px) {
    padding-inline: 1.5rem;
  }
`

export const DetailGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 1fr) 340px;
  }
`

export const PrimaryColumn = styled.section`
  min-width: 0;
`

export const PreviewFrame = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
`

export const PreviewIframe = styled.iframe`
  aspect-ratio: 16 / 9;
  display: block;
  width: 100%;
  border-radius: var(--radius-xl);
  border: 0;
  background: transparent;
`

export const HeroMetaRow = styled.div`
  margin-top: 0.75rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`

export const HeroTextCol = styled.div`
  min-width: 0;
  flex: 1 1 0%;
`

export const TitleRow = styled.div`
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
  @media (min-width: 640px) {
    column-gap: 0.625rem;
  }
`

export const TitleH1 = styled.h1`
  margin: 0;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 500;
  @media (min-width: 640px) {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
`

export const SubMetaLine = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--muted-foreground);
  @media (min-width: 640px) {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
`

export const SubMetaNums = styled.span`
  ${tabular};
`

export const HeroActions = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  column-gap: 0.375rem;
  align-self: flex-start;
  @media (min-width: 640px) {
    align-self: center;
  }
`

export const DetailRemixJumpButton = styled(Button)`
  height: 2.25rem;
  min-height: 2.25rem;
  flex-shrink: 0;
  column-gap: 0.375rem;
  border-radius: 9999px;
  border: 0;
  padding-inline: 0.625rem;
  color: var(--muted-foreground);
  background: transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: transparent !important;
    color: var(--foreground);
  }

  .dark &:hover {
    background: transparent !important;
  }

  @media (min-width: 640px) {
    height: 2.5rem;
    min-height: 2.5rem;
  }
`

export const Icon16 = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const TabularText = styled.span`
  ${tabular};
`

export const VoteGroup = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  gap: 0;
  overflow: hidden;
  border-radius: 9999px;
`

export const VoteIconBtn = styled.button<{ $active?: boolean; $tone?: "up" | "down" }>`
  display: inline-flex;
  height: 2.25rem;
  width: 1.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  padding-inline: 0;
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 150ms ease, background-color 150ms ease;

  &:hover {
    background: transparent;
    color: var(--foreground);
  }

  .dark &:hover {
    background: transparent;
  }

  ${(p) =>
    p.$active &&
    p.$tone === "up" &&
    css`
      color: var(--color-alt-green-deep);
    `}

  ${(p) =>
    p.$active &&
    p.$tone === "down" &&
    css`
      color: var(--color-alt-red-deep);
    `}

  @media (min-width: 640px) {
    height: 2.5rem;
    width: 1.75rem;
  }
`

export const VoteArrowWrap = styled.span`
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 640px) {
    width: 1.75rem;
    height: 1.75rem;
  }
`

type ScoreTone = "positive" | "negative" | "neutral"

export const ScoreValue = styled.span<{ $tone: ScoreTone }>`
  min-width: 2.1rem;
  flex-shrink: 0;
  padding-inline: 0;
  text-align: center;
  font-size: 1rem;
  line-height: 1;
  font-weight: 500;
  ${tabular};

  ${(p) =>
    p.$tone === "positive" &&
    css`
      color: var(--color-alt-green-deep);
    `}
  ${(p) =>
    p.$tone === "negative" &&
    css`
      color: var(--color-alt-red-deep);
    `}

  @media (min-width: 640px) {
    min-width: 2.4rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
`

export const DetailTabs = styled(Tabs)`
  margin-top: 1rem;
  width: 100%;
  min-width: 0;
`

export const DetailTabsList = styled(TabsList)`
  margin-bottom: 0;
  width: 100%;
  min-width: 0;
  justify-content: space-between;
  gap: 0.25rem;
  border-bottom: 1px solid rgb(0 0 0 / 8%);
  background: transparent;
  padding: 0;
  padding-bottom: 0;
  padding-top: 0;

  .dark & {
    border-color: rgb(255 255 255 / 12%);
  }

  @media (min-width: 640px) {
    justify-content: flex-start;
    gap: 2.5rem;
  }
`

export const DetailTabsTrigger = styled(TabsTrigger)`
  flex-shrink: 0;
  padding-inline: 0.25rem;
  @media (min-width: 640px) {
    padding-inline: 0;
  }
`

export const TabsPanelComments = styled(TabsContent)`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const CommentComposerShell = styled.div`
  position: relative;
`

export const CommentComposerTextarea = styled.textarea`
  min-height: 88px;
  width: 100%;
  resize: vertical;
  border-radius: var(--radius-2xl);
  border: 0;
  background: #fff;
  padding: 0.625rem 3rem 0.75rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--foreground);
  outline: none;
  box-shadow: none;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring) 30%, transparent);
  }

  .dark & {
    background: var(--background);
  }
`

export const PostCommentFab = styled.button`
  position: absolute;
  right: 0.625rem;
  top: 0.625rem;
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 0;
  background: color-mix(in oklab, var(--foreground) 10%, transparent);
  color: var(--foreground);
  box-shadow: none;
  outline: none;
  cursor: pointer;
  transition:
    transform 120ms ease,
    background-color 150ms ease,
    opacity 150ms ease;

  &:hover {
    background: color-mix(in oklab, var(--foreground) 16%, transparent);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    box-shadow:
      0 0 0 2px var(--ring),
      0 0 0 4px var(--background);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.35;
  }

  .dark & {
    background: rgb(255 255 255 / 12%);
  }

  .dark &:hover {
    background: rgb(255 255 255 / 18%);
  }
`

export const PostCommentFabIcon = styled.span`
  display: inline-flex;
  width: 1rem;
  height: 1rem;

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const EmptyComments = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block: 1.5rem;
  text-align: center;
`

export const EmptyCommentsIcon = styled.span`
  display: inline-flex;
  width: 3.5rem;
  height: 3.5rem;
  color: color-mix(in oklab, oklch(0.7 0.15 230) 90%, transparent);

  .dark & {
    color: color-mix(in oklab, oklch(0.65 0.14 230) 80%, transparent);
  }

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const EmptyCommentsTitle = styled.p`
  margin: 1rem 0 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--foreground);
`

export const EmptyCommentsHint = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--muted-foreground);
`

export const CommentsStatRowList = styled(StatRowList).attrs({ as: "ul" })`
  margin-top: 1.5rem;
`

export const CommentStatRow = styled(StatRow).attrs({ as: "li" })`
  display: flex;
  gap: 0.5rem;
`

export const CommentAvatar = styled(Avatar)`
  aspect-ratio: 1;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 9999px;

  &::after {
    border-radius: 9999px;
  }
`

export const CommentAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 10px;
`

export const CommentBlock = styled.div`
  min-width: 0;
  flex: 1 1 0%;
`

export const CommentMeta = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--muted-foreground);
`

export const CommentAuthor = styled.span`
  font-weight: 500;
  color: var(--foreground);
`

export const CommentBody = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: color-mix(in oklab, var(--foreground) 90%, transparent);
`

export const TabsPanelPlain = styled(TabsContent)`
  margin-top: 1rem;
`

export const HolderStatRow = styled(StatRow).attrs({ as: "li" })`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const HolderRank = styled.span`
  width: 1.25rem;
  flex-shrink: 0;
  ${tabular};
  color: var(--muted-foreground);
`

export const HolderAvatar = styled(Avatar)`
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 9999px;

  &::after {
    border-radius: 9999px;
  }
`

export const HolderAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 10px;
`

export const HolderName = styled.span`
  min-width: 0;
  flex: 1 1 0%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: var(--foreground);
`

export type HolderBadgeTone = "green" | "blue" | "muted"

export const HolderBadge = styled.span<{ $tone: HolderBadgeTone }>`
  flex-shrink: 0;
  border-radius: var(--radius-md);
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  ${tabular};

  ${(p) =>
    p.$tone === "green" &&
    css`
      background: var(--color-alt-green-deep);
      color: #fff;
    `}

  ${(p) =>
    p.$tone === "blue" &&
    css`
      background: oklch(0.55 0.17 250);
      color: #fff;

      .dark & {
        background: oklch(0.58 0.16 250);
      }
    `}

  ${(p) =>
    p.$tone === "muted" &&
    css`
      background: rgb(0 0 0 / 6%);
      color: color-mix(in oklab, var(--foreground) 80%, transparent);

      .dark & {
        background: rgb(255 255 255 / 10%);
      }
    `}
`

export const ActivityStatRow = styled(StatRow).attrs({ as: "li" })`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2.75rem 4rem 4.25rem 2.75rem;
  align-items: center;
  column-gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: minmax(0, 1fr) 3rem 4.25rem 4.5rem 3rem;
    column-gap: 1rem;
  }
`

export const ActivityWhoCell = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
`

export const ActivityAvatar = styled(Avatar)`
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 9999px;

  &::after {
    border-radius: 9999px;
  }
`

export const ActivityAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 9px;
`

export const ActivityWho = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: var(--foreground);
`

export const ActivityBuy = styled.span`
  justify-self: start;
  font-weight: 500;
  color: var(--color-alt-green-deep);

  .dark & {
    color: var(--color-alt-green-lime);
  }
`

export const ActivityQty = styled.span`
  justify-self: end;
  ${tabular};
  color: var(--foreground);
`

export const ActivityPrice = styled.span`
  justify-self: end;
  ${tabular};
  color: var(--muted-foreground);
`

export const ActivityAgo = styled.span`
  justify-self: end;
  ${tabular};
  color: var(--muted-foreground);
`

export const DetailsStatRow = styled(StatRow)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`

export const ContractValueRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  ${tabular};
`

export const CopyIconButton = styled.button`
  border-radius: var(--radius-sm);
  padding: 0.125rem;
  border: 0;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;

  &:hover {
    color: var(--foreground);
  }
`

export const CopyIcon = styled.span`
  display: inline-flex;
  width: 0.875rem;
  height: 0.875rem;

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const RemixAside = styled.aside`
  min-width: 0;
  scroll-margin-top: 6rem;
`

export const RemixAsideTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--muted-foreground);
`

export const RemixAsideList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const RemixCardLink = styled(Link)`
  display: flex;
  gap: 0.5rem;
  border-radius: var(--radius-xl);
  padding: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: background-color 150ms ease;

  &:hover {
    background: color-mix(in oklab, var(--muted) 40%, transparent);
  }

  .dark &:hover {
    background: color-mix(in oklab, var(--muted) 20%, transparent);
  }
`

export const RemixThumb = styled.div`
  width: 9rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--radius-md);
`

export const RemixThumbIframe = styled.iframe`
  pointer-events: none;
  display: block;
  height: 5rem;
  width: 100%;
  border: 0;
`

export const RemixCardBody = styled.div`
  min-width: 0;
`

export const RemixCardTitle = styled.p`
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375;
`

export const RemixCardMeta = styled.p`
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--muted-foreground);
`

export const RemixCardAuthor = styled.span`
  font-weight: 500;
  color: color-mix(in oklab, var(--foreground) 80%, transparent);
`

export const RemixCardVotes = styled.p`
  margin: 0.125rem 0 0;
  font-size: 0.75rem;
  line-height: 1rem;
  ${tabular};
  color: var(--muted-foreground);
`
