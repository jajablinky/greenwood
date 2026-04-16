import { ThemeProvider } from "styled-components"

import { GlobalStyle } from "app/styles"
import { defaultStyledTheme } from "helpers/themes"

export function StyledComponentsRoot({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={defaultStyledTheme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  )
}
