/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PCO_APP_ID?: string;
  readonly VITE_PCO_SECRET?: string;
  readonly VITE_CORS_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
