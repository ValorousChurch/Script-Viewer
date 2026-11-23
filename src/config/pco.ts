export interface PcoRuntimeConfig {
  corsProxyUrl: string;
}

let cachedConfig: PcoRuntimeConfig | null = null;

export function getPcoRuntimeConfig(): PcoRuntimeConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const corsProxyUrl = import.meta.env.VITE_CORS_PROXY_URL?.trim();

  if (!corsProxyUrl) {
    throw new Error(
      "Missing Planning Center proxy URL. Set VITE_CORS_PROXY_URL.",
    );
  }

  cachedConfig = { corsProxyUrl };

  return cachedConfig;
}
