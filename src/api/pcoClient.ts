import { getPcoRuntimeConfig } from "@/config/pco";

interface ProxyResponse<T> {
  data: T;
}

export class PcoClient {
  readonly baseUrl = "https://api.planningcenteronline.com/services/v2";

  private buildProxyUrl(url: string): string {
    const { corsProxyUrl } = getPcoRuntimeConfig();
    const separator = corsProxyUrl.includes("?") ? "&" : "?";
    return `${corsProxyUrl}${separator}apiurl=${encodeURIComponent(url)}`;
  }

  private createAuthHeader(): string {
    const { appId, secret } = getPcoRuntimeConfig();
    return `Basic ${btoa(`${appId}:${secret}`)}`;
  }

  async get<T>(path: string): Promise<T> {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
    const response = await fetch(this.buildProxyUrl(url), {
      method: "GET",
      headers: {
        Authorization: this.createAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Planning Center request failed with ${response.status}.`);
    }

    const payload = (await response.json()) as ProxyResponse<T>;

    if (!("data" in payload)) {
      throw new Error("Planning Center proxy response did not include a data field.");
    }

    return payload.data;
  }
}

export const pcoClient = new PcoClient();
