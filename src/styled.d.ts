import "styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
    /** Reserved for future semantic tokens; most styles use CSS variables on :root. */
    mode: "light" | "dark"
  }
}
