import { mount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";

describe("HomeView", () => {
  it("renders the service type selector", () => {
    const wrapper = mount(HomeView);

    expect(wrapper.text()).toContain("To begin, please select a service type.");
    expect(wrapper.text()).toContain("Weekend Production");
  });
});
