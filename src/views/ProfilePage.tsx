import { useParams } from "react-router-dom"

import { ConnectWalletButton } from "components/molecules/ConnectWalletButton"
import { useArweaveProvider } from "providers/ArweaveProvider"
import { abbreviateWalletAddress } from "helpers/abbrev-wallet"

import * as S from "views/ActivityFeed/styles"

export default function ProfilePage() {
  const { author } = useParams<{ author?: string }>()
  const { walletAddress } = useArweaveProvider()

  const authorHandle = author
    ? (() => {
        try {
          return decodeURIComponent(author)
        } catch {
          return author
        }
      })()
    : null

  return (
    <S.Page>
      <S.StickyHeader>
        <S.HeaderInner>
          <S.HeaderBrandWrap>
            <S.HeaderBrandLink to="/">PermawebOS</S.HeaderBrandLink>
          </S.HeaderBrandWrap>
          <S.HeaderActions>
            <ConnectWalletButton />
          </S.HeaderActions>
        </S.HeaderInner>
      </S.StickyHeader>
      <S.FeedMain>
        {authorHandle ? (
          <>
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
              Builder profile (placeholder). Activity and apps for this handle
              will appear here.
            </p>
          </>
        ) : (
          <>
            <p
              style={{
                margin: "0 0 0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              You
            </p>
            <p
              style={{ margin: 0, fontSize: "0.9375rem", color: "var(--muted-foreground)" }}
            >
              {walletAddress
                ? `Connected as ${abbreviateWalletAddress(walletAddress)}.`
                : "Connect a wallet to publish and manage projects."}
            </p>
          </>
        )}
      </S.FeedMain>
    </S.Page>
  )
}
