import type { DefaultTheme } from "styled-components"

/** Derive styled-components theme mode from the root element class list. */
export function styledThemeForRootClass(rootClass: string): DefaultTheme {
  return { mode: rootClass === "dark" ? "dark" : "light" }
}

export const defaultStyledTheme: DefaultTheme = { mode: "light" }
