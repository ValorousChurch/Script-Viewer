import router from "@/router";

describe("router", () => {
  it("resolves the public route contract under the GitHub Pages base path", () => {
    expect(router.resolve("/").href).toBe("/Script-Viewer/");
    expect(router.resolve("/list/41396").href).toBe("/Script-Viewer/list/41396");
    expect(router.resolve("/plan/41396/123/audio").href).toBe(
      "/Script-Viewer/plan/41396/123/audio",
    );
  });
});
