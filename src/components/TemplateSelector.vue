<template>
  <div class="page">
    <div class="templateSelector">
      <p>Select the plan template you would like to view.</p>
      <RouterLink
        v-for="templateOption in templates"
        :key="templateOption.name"
        class="templateLink"
        :class="{ active: templateOption.name === activeTemplateName }"
        :style="{ width: `calc(${100 / templates.length}% - 10px)` }"
        :to="{
          name: 'plan-detail',
          params: {
            serviceType,
            planId,
            type: templateOption.name === 'default' ? undefined : templateOption.name,
          },
        }"
      >
        {{ templateOption.label }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { planTemplates } from "@/config/planTemplates";
import type { PlanTemplate } from "@/types/plans";

defineProps<{
  activeTemplateName: PlanTemplate["name"];
  serviceType: string;
  planId: string;
}>();

const templates = Object.values(planTemplates);
</script>
