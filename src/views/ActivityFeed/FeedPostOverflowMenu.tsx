import { useCallback } from "react"
import { Menu } from "@base-ui/react/menu"
import {
  Copy,
  ExternalLink,
  Globe,
  MoreVertical,
  Share2,
} from "assets/icons"
import { useNavigate } from "react-router-dom"

import { feedDetailAbsoluteUrl } from "helpers/feed-detail-url"
import { useToaster } from "providers/ToasterProvider"

import * as S from "./styles"

type FeedPostOverflowMenuProps = {
  detailPath: string
  transactionId: string
  cardLabel: string
}

export function FeedPostOverflowMenu({
  detailPath,
  transactionId,
  cardLabel,
}: FeedPostOverflowMenuProps) {
  const navigate = useNavigate()
  const { push } = useToaster()

  const url = feedDetailAbsoluteUrl(detailPath)

  const copyLink = useCallback(() => {
    void navigator.clipboard.writeText(url).then(
      () => {
        push({ title: "Link copied", variant: "success" })
      },
      () => {
        push({ title: "Could not copy link", variant: "warning" })
      },
    )
  }, [push, url])

  const shareLink = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url, title: cardLabel })
      } else {
        await navigator.clipboard.writeText(url)
        push({ title: "Link copied", variant: "success" })
      }
    } catch {
      /* user cancelled share sheet */
    }
  }, [cardLabel, push, url])

  const viewTransaction = useCallback(() => {
    const href = `https://viewblock.io/arweave/tx/${encodeURIComponent(transactionId)}`
    window.open(href, "_blank", "noopener,noreferrer")
  }, [transactionId])

  const viewApp = useCallback(() => {
    navigate(detailPath)
  }, [detailPath, navigate])

  return (
    <Menu.Root modal={false}>
      <S.FeedPostOverflowTrigger
        type="button"
        aria-label={`More options for ${cardLabel}`}
        onPointerDown={(e) => {
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <MoreVertical width={18} height={18} strokeWidth={2} aria-hidden />
      </S.FeedPostOverflowTrigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={6}>
          <S.FeedPostOverflowPopup>
            <S.FeedPostOverflowMenuItem
              onClick={(e) => {
                e.stopPropagation()
                copyLink()
              }}
            >
              <S.FeedPostOverflowMenuItemIcon>
                <Copy strokeWidth={2} aria-hidden />
              </S.FeedPostOverflowMenuItemIcon>
              Copy link
            </S.FeedPostOverflowMenuItem>
            <S.FeedPostOverflowMenuItem
              onClick={(e) => {
                e.stopPropagation()
                void shareLink()
              }}
            >
              <S.FeedPostOverflowMenuItemIcon>
                <Share2 strokeWidth={2} aria-hidden />
              </S.FeedPostOverflowMenuItemIcon>
              Share link
            </S.FeedPostOverflowMenuItem>
            <S.FeedPostOverflowMenuItem
              onClick={(e) => {
                e.stopPropagation()
                viewTransaction()
              }}
            >
              <S.FeedPostOverflowMenuItemIcon>
                <ExternalLink strokeWidth={2} aria-hidden />
              </S.FeedPostOverflowMenuItemIcon>
              View transaction on chain
            </S.FeedPostOverflowMenuItem>
            <S.FeedPostOverflowMenuItem
              onClick={(e) => {
                e.stopPropagation()
                viewApp()
              }}
            >
              <S.FeedPostOverflowMenuItemIcon>
                <Globe strokeWidth={2} aria-hidden />
              </S.FeedPostOverflowMenuItemIcon>
              View app
            </S.FeedPostOverflowMenuItem>
          </S.FeedPostOverflowPopup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
