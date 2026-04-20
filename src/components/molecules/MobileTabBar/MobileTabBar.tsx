import { Bell, Home, SquarePlus } from "assets/icons"
import { useMatch, useNavigate } from "react-router-dom"

import * as S from "./styles"

const ICON = 20

function iconStroke(active: boolean) {
  return active ? 2.35 : 1.65
}

function HomeGlyph() {
  const home = useMatch({ path: "/", end: true })
  const active = home != null
  return (
    <Home
      width={ICON}
      height={ICON}
      strokeWidth={iconStroke(active)}
      fill={active ? "currentColor" : "none"}
      aria-hidden
    />
  )
}

function NotificationsGlyph() {
  const m = useMatch({ path: "/notifications", end: true })
  const active = m != null
  return (
    <Bell
      width={ICON}
      height={ICON}
      strokeWidth={iconStroke(active)}
      aria-hidden
    />
  )
}

export function MobileTabBar() {
  const navigate = useNavigate()

  const openCreate = () => {
    navigate({ pathname: "/", search: "?action=create" })
  }

  return (
    <S.Bar aria-label="Main">
      <S.TabNavLink to="/" end>
        <S.IconSlot>
          <HomeGlyph />
        </S.IconSlot>
        <span data-tab-label>Home</span>
      </S.TabNavLink>

      <S.TabButton type="button" onClick={openCreate} aria-label="Create">
        <S.IconSlot>
          <SquarePlus
            width={ICON}
            height={ICON}
            strokeWidth={iconStroke(false)}
            aria-hidden
          />
        </S.IconSlot>
        <span data-tab-label>Create</span>
      </S.TabButton>

      <S.TabNavLink to="/notifications">
        <S.IconSlot>
          <NotificationsGlyph />
          <S.BellBadge aria-hidden>2</S.BellBadge>
        </S.IconSlot>
        <span data-tab-label>Notifications</span>
      </S.TabNavLink>
    </S.Bar>
  )
}
