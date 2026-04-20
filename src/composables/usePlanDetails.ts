import { computed, ref, toValue, watch } from "vue";
import { planTemplates, resolveTemplateName } from "@/config/planTemplates";
import { shapePlanRows } from "@/services/planTransforms";
import { planningCenterService } from "@/services/planningCenterService";
import type { PlanDetails } from "@/types/plans";

type MaybeParam = string | undefined | (() => string | undefined);

export function usePlanDetails(
  serviceType: MaybeParam,
  planId: MaybeParam,
  templateName: MaybeParam,
) {
  const plan = ref<PlanDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadPlan(currentServiceType: string, currentPlanId: string) {
    loading.value = true;
    error.value = null;

    try {
      plan.value = await planningCenterService.getPlanDetails(currentServiceType, currentPlanId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unable to load plan details.";
      plan.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(
    [() => toValue(serviceType), () => toValue(planId)],
    ([currentServiceType, currentPlanId]) => {
      if (!currentServiceType || !currentPlanId) {
        plan.value = null;
        return;
      }

      void loadPlan(currentServiceType, currentPlanId);
    },
    { immediate: true },
  );

  const resolvedTemplateName = computed(() => resolveTemplateName(toValue(templateName)));
  const template = computed(() => planTemplates[resolvedTemplateName.value]);
  const rows = computed(() =>
    plan.value ? shapePlanRows(plan.value.items, template.value, resolvedTemplateName.value) : [],
  );
  const versionText = computed(() => {
    if (!plan.value) {
      return "";
    }

    return plan.value.planVersion === "NONE"
      ? "** PLAN IS UNFINALIZED **"
      : `** INFORMATION ${plan.value.planVersion} **`;
  });
  const titleText = computed(() => {
    if (!plan.value) {
      return "";
    }

    return `${plan.value.planTitle ? `${plan.value.planTitle} - ` : ""}${plan.value.planDates}`;
  });
  const isDraft = computed(() => plan.value?.planVersion === "NONE");

  return {
    plan,
    loading,
    error,
    template,
    templateName: resolvedTemplateName,
    rows,
    versionText,
    titleText,
    isDraft,
  };
}
