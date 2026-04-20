import { ref, toValue, watch } from "vue";
import { planningCenterService } from "@/services/planningCenterService";
import type { PlanSummary } from "@/types/plans";

export function usePlanList(serviceType: string | (() => string | undefined) | undefined) {
  const plans = ref<PlanSummary[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadPlans(currentServiceType: string) {
    loading.value = true;
    error.value = null;

    try {
      plans.value = await planningCenterService.getFuturePlans(currentServiceType);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unable to load plans.";
      plans.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => toValue(serviceType),
    (currentServiceType) => {
      if (!currentServiceType) {
        plans.value = [];
        return;
      }

      void loadPlans(currentServiceType);
    },
    { immediate: true },
  );

  return {
    plans,
    loading,
    error,
  };
}
