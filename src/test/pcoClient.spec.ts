import { PcoClient } from "@/api/pcoClient";

describe("PcoClient", () => {
  it("sends Planning Center requests to the Worker without browser credentials", async () => {
    const proxyUrl = "https://worker.example/proxy/";
    const path = "/service_types?per_page=10";
    const client = new PcoClient();
    const data = [{ id: "101" }];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data }),
    });

    vi.stubEnv("VITE_CORS_PROXY_URL", proxyUrl);
    vi.stubGlobal("fetch", fetchMock);

    try {
      await expect(client.get(path)).resolves.toEqual(data);
      expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
        `${proxyUrl}?apiurl=${encodeURIComponent(client.baseUrl + path)}`,
      );
    } finally {
      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    }
  });
});
