export interface PcoRuntimeConfig {
  appId: string;
  secret: string;
  corsProxyUrl: string;
}

let cachedConfig: PcoRuntimeConfig | null = null;

export function getPcoRuntimeConfig(): PcoRuntimeConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const appId = import.meta.env.VITE_PCO_APP_ID?.trim();
  const secret = import.meta.env.VITE_PCO_SECRET?.trim();
  const corsProxyUrl = import.meta.env.VITE_CORS_PROXY_URL?.trim();

  if (!appId || !secret || !corsProxyUrl) {
    throw new Error(
      "Missing Planning Center configuration. Set VITE_PCO_APP_ID, VITE_PCO_SECRET, and VITE_CORS_PROXY_URL.",
    );
  }

  cachedConfig = {
    appId,
    secret,
    corsProxyUrl,
  };

  return cachedConfig;
}
