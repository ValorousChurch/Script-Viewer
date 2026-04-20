import { mount } from "@vue/test-utils";
import type { PlanDetails } from "@/types/plans";
import PlanDetailView from "@/views/PlanDetailView.vue";

const mockPlan: PlanDetails = {
  serviceType: "41396",
  planId: "123",
  planTitle: "Weekend",
  planDates: "Sunday, April 20",
  planVersion: "v1",
  items: [
    {
      id: "row-1",
      arrangementId: null,
      arrangement: null,
      description: null,
      details: "<strong>Detail</strong>",
      key: "D",
      length: 180,
      notes: {
        Vocals: "Lead",
        Sides: "Lyrics",
        Audio: "Band cue",
        Source: "Playback",
      },
      position: 1,
      songId: null,
      title: "Opening Song",
      type: "song",
      clock: 180,
    },
  ],
};

vi.mock("vue-router", async () => {
  const actual = await vi.importActual<typeof import("vue-router")>("vue-router");
  return {
    ...actual,
    useRoute: () => ({
      params: { serviceType: "41396", planId: "123", type: "audio" },
    }),
  };
});

vi.mock("@/composables/usePlanDetails", async () => {
  const { computed, ref } = await import("vue");
  const { planTemplates } = await import("@/config/planTemplates");
  return {
    usePlanDetails: () => ({
      plan: ref(mockPlan),
      loading: ref(false),
      error: ref(null),
      template: computed(() => planTemplates.audio),
      templateName: computed(() => "audio"),
      rows: computed(() => [
        {
          id: "row-1",
          type: "item",
          clockDisplay: "03:00",
          lengthDisplay: "03:00",
          title: "Opening Song",
          descriptionHtml: "<em>Lead</em>",
          noteColumns: ["Lyrics", 'Band cue<br /><span class="source">Playback</span>'],
        },
      ]),
      versionText: computed(() => "** INFORMATION v1 **"),
      titleText: computed(() => "Weekend - Sunday, April 20"),
    }),
  };
});

describe("PlanDetailView", () => {
  it("renders plan metadata, template links, and template columns", () => {
    const wrapper = mount(PlanDetailView);

    expect(wrapper.text()).toContain("PRODUCTION SCRIPT: Weekend - Sunday, April 20");
    expect(wrapper.text()).toContain("Audio");
    expect(wrapper.findAll("th").map((cell) => cell.text())).toEqual([
      "Clock",
      "Time",
      "Element",
      "Side Screens",
      "Audio",
    ]);
  });
});
