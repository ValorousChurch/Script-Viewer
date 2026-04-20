import { flushPromises, mount } from "@vue/test-utils";
import PlanListView from "@/views/PlanListView.vue";

vi.mock("vue-router", async () => {
  const actual = await vi.importActual<typeof import("vue-router")>("vue-router");
  return {
    ...actual,
    useRoute: () => ({
      params: { serviceType: "41396" },
    }),
  };
});

vi.mock("@/services/planningCenterService", () => ({
  planningCenterService: {
    getFuturePlans: vi.fn().mockResolvedValue([
      { id: "101", serviceType: "41396", dates: "Sunday, April 20", title: "Weekend" },
    ]),
  },
}));

describe("PlanListView", () => {
  it("loads future plans and renders working links", async () => {
    const wrapper = mount(PlanListView);

    await flushPromises();

    expect(wrapper.text()).toContain("Please select a plan.");
    expect(wrapper.text()).toContain("Sunday, April 20");
    expect(wrapper.find("a").exists()).toBe(true);
  });
});
