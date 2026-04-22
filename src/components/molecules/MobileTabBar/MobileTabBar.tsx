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

function ProfileGlyph() {
  const m = useMatch({ path: "/profile", end: false })
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
      <S.TabNavLink to="/" end aria-label="Home">
        <S.IconSlot>
          <HomeGlyph />
        </S.IconSlot>
      </S.TabNavLink>

      <S.TabButton type="button" onClick={openCreate} aria-label="Create app">
        <S.IconSlot>
          <SquarePlus
            width={ICON}
            height={ICON}
            strokeWidth={iconStroke(false)}
            aria-hidden
          />
        </S.IconSlot>
      </S.TabButton>

      <S.TabNavLink to="/profile" aria-label="Profile and activity">
        <S.IconSlot>
          <ProfileGlyph />
        </S.IconSlot>
      </S.TabNavLink>
    </S.Bar>
  )
}
