/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base path for API calls. Defaults to "/api". */
  readonly VITE_API_BASE_URL?: string
  /** Human-readable environment name, e.g. "production". */
  readonly VITE_APP_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}