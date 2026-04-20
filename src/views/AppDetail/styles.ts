import styled, { css } from "styled-components"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "components/atoms/Avatar"
import { Button } from "components/atoms/Button"
import { statRowShellCss } from "components/molecules/StatRow"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/atoms/Tabs"
import {
  InlineComposerFab,
  InlineComposerTextarea,
} from "components/molecules/CommentThread/styles"

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
  border: none;
  box-shadow: none;
  background: #ffffff;
  .dark & {
    background: var(--background);
  }
`

export const HeaderInner = styled.div`
  margin-inline: auto;
  display: flex;
  max-width: 48rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.375rem 0.375rem;
  @media (min-width: 640px) {
    padding: 0.5rem 1.5rem;
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
  max-width: 48rem;
  padding: 1rem;
  @media (min-width: 640px) {
    padding-inline: 1.5rem;
  }
`

export const DetailGrid = styled.div`
  display: grid;
  gap: 1.25rem;
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
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`

export const HeroTextCol = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 1 0%;
  flex-direction: column;
  align-items: stretch;
  align-self: stretch;
`

export const TitleRow = styled.div`
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
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
  align-self: center;
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

  &:hover:not(:disabled) {
    background: color-mix(in oklab, var(--foreground) 10%, transparent) !important;
    color: var(--foreground);
  }

  .dark &:hover:not(:disabled) {
    background: color-mix(in oklab, var(--foreground) 14%, transparent) !important;
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
`

export const VoteIconBtn = styled(Button).attrs({ type: "button" })`
  display: inline-flex;
  box-sizing: border-box;
  width: 2.25rem;
  height: 2.25rem;
  min-width: 2.25rem;
  min-height: 2.25rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
  transition: color 150ms ease, background-color 150ms ease;

  @media (min-width: 640px) {
    width: 2.5rem;
    height: 2.5rem;
    min-width: 2.5rem;
    min-height: 2.5rem;
  }
`

export const VoteArrowWrap = styled.span`
  display: inline-flex;
  width: 1rem;
  height: 1rem;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 640px) {
    width: 1rem;
    height: 1rem;
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

export const TabsPanelComments = styled(TabsContent).attrs({
  id: "comments",
})`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
`

/** Comments-only layout (tabs hidden). Keeps #comments for deep links. */
export const CommentsSection = styled.section`
  margin-top: 1rem;
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  gap: 0;
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

export const TabsPanelPlain = styled(TabsContent)`
  margin-top: 1rem;
`

/**
 * Shared flex layout for every tab row. Pairs with `statRowShellCss` below so
 * Details / Holders / Activity share the same padding and alignment.
 */
const detailTabsRowLayout = css`
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 0;
`

/** Row for Details (nested inside a `<dl>`). */
export const DetailTabsStatRow = styled.div<{ $striped?: boolean }>`
  ${({ $striped }) => statRowShellCss($striped)}
  ${detailTabsRowLayout}
`

/** Row for Holders / Activity (nested inside a `<ul>`). */
export const DetailTabsStatRowLi = styled.li<{ $striped?: boolean }>`
  ${({ $striped }) => statRowShellCss($striped)}
  ${detailTabsRowLayout}
`

/** Primary cluster (avatar, name, or trader + avatar) — flexes like the details label column. */
export const TabRowLead = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 1 0%;
  align-items: center;
  gap: 0.75rem;
`

/** Trailing grid for activity: Buy · qty · price · time (who lives in TabRowLead). */
export const TabActivityTrail = styled.div`
  display: grid;
  flex-shrink: 0;
  grid-template-columns: 2.75rem 4rem 4.25rem 2.75rem;
  align-items: center;
  column-gap: 0.75rem;

  @media (min-width: 640px) {
    grid-template-columns: 3rem 4.25rem 4.5rem 3rem;
    column-gap: 1rem;
  }
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

export const ActivityWhoCell = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 1 0%;
  align-items: center;
  gap: 0.5rem;
`

export const ActivityAvatar = styled(Avatar)`
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 9999px;

  &::after {
    border-radius: 9999px;
  }
`

export const ActivityAvatarFallback = styled(AvatarFallback)`
  border-radius: inherit;
  font-size: 10px;
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

export const ContractValueRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  ${tabular};
`

export const CopyIconButton = styled(Button).attrs({
  type: "button",
  variant: "ghost",
  size: "icon-xs",
})`
  width: auto;
  height: auto;
  min-width: 0;
  min-height: 0;
  border-radius: var(--radius-sm);
  padding: 0.125rem;

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
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgb(0 0 0 / 8%);

  .dark & {
    border-color: rgb(255 255 255 / 12%);
  }
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

/** Create mode + focus-within: context pill, round send; textarea stays flush with page (no fill). */
export const DetailComposerWrapper = styled.div`
  ${InlineComposerTextarea} {
    background: transparent;
  }

  .dark & ${InlineComposerTextarea} {
    background: transparent;
  }

  &[data-create-mode="true"]:focus-within .detail-create-context-tag {
    display: inline-flex;
  }

  &[data-create-mode="true"]:focus-within ${InlineComposerFab} {
    width: 2.5rem;
    height: 2.5rem;
    min-height: 2.5rem;
    border-radius: 50%;
    background: oklch(0.97 0 0);
    color: var(--muted-foreground);
    box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
  }

  &[data-create-mode="true"]:focus-within ${InlineComposerFab}:hover:not(:disabled) {
    background: oklch(0.94 0 0);
    color: var(--foreground);
  }

  .dark &[data-create-mode="true"]:focus-within ${InlineComposerFab} {
    background: oklch(0.27 0 0);
    color: var(--muted-foreground);
    box-shadow: none;
  }

  .dark &[data-create-mode="true"]:focus-within ${InlineComposerFab}:hover:not(:disabled) {
    background: oklch(0.32 0 0);
    color: var(--foreground);
  }
`

export const DetailComposerFieldRow = styled.div`
  position: relative;
`

export const DetailCreateContextTag = styled.div.attrs({
  className: "detail-create-context-tag",
})`
  display: none;
  align-items: center;
  gap: 0.375rem;
  margin: 0 0 0.5rem;
  max-width: 100%;
  padding: 0.28rem 0.65rem 0.28rem 0.5rem;
  border-radius: 9999px;
  background: var(--color-permaweb-blue-4-light);
  color: var(--color-permaweb-blue-1-deep);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;

  .dark & {
    background: color-mix(
      in oklab,
      var(--color-permaweb-blue-1-deep) 28%,
      var(--card)
    );
    color: var(--color-permaweb-blue-3-baby);
  }
`

export const DetailCreateContextIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 0.8125rem;
  height: 0.8125rem;

  & > svg {
    width: 100%;
    height: 100%;
  }
`

export const DetailCreateContextText = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ThoughtPanel = styled.div`
  margin-bottom: 0.75rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--muted);
  padding: 0.5rem 0.65rem;
`

export const ThoughtPanelLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  margin-bottom: 0.35rem;
`

export const ThoughtPre = styled.pre`
  margin: 0;
  max-height: 12rem;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--foreground);
`

export const OuroRemixStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const OuroRemixHint = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.35;
  color: var(--muted-foreground);
`

export const OuroRemixTextarea = styled.textarea`
  width: 100%;
  resize: none;
  min-height: 5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
  font: inherit;
  font-size: 0.8125rem;
  padding: 0.5rem 0.65rem;
  outline: none;

  &:focus {
    border-color: var(--ring);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--ring) 25%, transparent);
  }
`

export const OuroRemixButton = styled(Button)`
  align-self: flex-start;
`

export {
  InlineComposerFab as PostCommentFab,
  InlineComposerFabIcon as PostCommentFabIcon,
  InlineComposerFabLabel as PostCommentFabLabel,
  InlineComposerShell as CommentComposerShell,
  InlineComposerTextarea as CommentComposerTextarea,
} from "components/molecules/CommentThread/styles"
