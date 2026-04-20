/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OUROBOROS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
