import { planTemplates } from "@/config/planTemplates";
import {
  buildDescriptionHtml,
  buildTemplateColumnHtml,
  calculateTimes,
  shapePlanRows,
} from "@/services/planTransforms";
import type { PlanItem } from "@/types/plans";

function makeItem(overrides: Partial<PlanItem>): PlanItem {
  return {
    id: "item-1",
    arrangementId: null,
    arrangement: null,
    description: null,
    details: null,
    key: null,
    length: 0,
    notes: {},
    position: 1,
    songId: null,
    title: "Item",
    type: "item",
    clock: "",
    ...overrides,
  };
}

describe("planTransforms", () => {
  it("preserves the reverse-pass clock calculation behavior", () => {
    const items = calculateTimes([
      makeItem({ id: "intro", title: "Intro", length: 30 }),
      makeItem({ id: "song", title: "Song", length: 120 }),
      makeItem({ id: "header", title: "Message", type: "header", length: 0 }),
      makeItem({ id: "message", title: "Message", length: 900 }),
    ]);

    expect(items.map((item) => item.clock)).toEqual([150, 120, "", 900]);
  });

  it("builds audio descriptions with arrangement metadata", () => {
    const html = buildDescriptionHtml(
      makeItem({
        type: "song",
        key: "C",
        notes: { Vocals: "Lead vocal" },
        arrangement: { bpm: 72, name: "Studio" },
      }),
      "audio",
    );

    expect(html).toContain("[Key: C, BPM: 72]");
    expect(html).toContain("Lead vocal");
  });

  it("appends item details to the description", () => {
    const html = buildDescriptionHtml(
      makeItem({
        notes: { Vocals: "Lead vocal" },
        details: "<strong>Extra detail</strong>",
      }),
      "default",
    );

    expect(html).toContain("Lead vocal");
    expect(html).toContain("<hr />");
    expect(html).toContain("Extra detail");
  });

  it("renders template columns including Source badges", () => {
    const html = buildTemplateColumnHtml(
      makeItem({
        notes: {
          Other: "Pastor note",
          Source: "ProPresenter",
        },
      }),
      ["Other", "Source"],
    );

    expect(html).toContain("Pastor note");
    expect(html).toContain('class="source"');
  });

  it("shapes template rows with the expected column count", () => {
    const rows = shapePlanRows(
      [
        makeItem({
          id: "row-1",
          title: "Song",
          length: 180,
          clock: 180,
          notes: { Sides: "Lyrics", Audio: "Band cue", Source: "Playback" },
        }),
      ],
      planTemplates.audio,
      "audio",
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].noteColumns).toHaveLength(2);
  });
});
