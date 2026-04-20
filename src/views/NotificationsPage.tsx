import * as S from "views/ActivityFeed/styles"

export default function NotificationsPage() {
  return (
    <S.Page>
      <S.StickyHeader>
        <S.HeaderInner>
          <S.HeaderBrandWrap>
            <S.HeaderBrandLink to="/">PermawebOS</S.HeaderBrandLink>
          </S.HeaderBrandWrap>
        </S.HeaderInner>
      </S.StickyHeader>
      <S.FeedMain>
        <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--muted-foreground)" }}>
          You are all caught up. No new notifications.
        </p>
      </S.FeedMain>
    </S.Page>
  )
}
