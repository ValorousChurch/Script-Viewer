import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PlanListView from "@/views/PlanListView.vue";
import PlanDetailView from "@/views/PlanDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/list/:serviceType",
      name: "plan-list",
      component: PlanListView,
    },
    {
      path: "/plan/:serviceType/:planId/:type?",
      name: "plan-detail",
      component: PlanDetailView,
    },
  ],
});

export default router;
