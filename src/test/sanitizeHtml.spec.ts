import { sanitizeHtml } from "@/utils/sanitizeHtml";

describe("sanitizeHtml", () => {
  it("preserves intended markup and strips unsafe content", () => {
    const sanitized = sanitizeHtml(
      '<em>Safe</em><br><img src="x" onerror="alert(1)"><script>alert(1)</script>',
    );

    expect(sanitized).toContain("<em>Safe</em>");
    expect(sanitized).toContain("<br>");
    expect(sanitized).not.toContain("onerror");
    expect(sanitized).not.toContain("<script>");
  });
});
