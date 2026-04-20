<template>
  <div class="page">
    <div class="planSelector">
      <p>Please select a plan.</p>
      <RouterLink
        v-for="plan in plans"
        :key="plan.id"
        :to="{ name: 'plan-detail', params: { serviceType: plan.serviceType, planId: plan.id } }"
      >
        {{ plan.dates }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { PlanSummary } from "@/types/plans";

defineProps<{
  plans: PlanSummary[];
}>();
</script>
