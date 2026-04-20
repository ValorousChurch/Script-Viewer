<template>
  <LoadingState v-if="loading" message="loading..." />
  <ErrorState v-else-if="error" :message="error" />
  <PlanSelector v-else :plans="plans" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import PlanSelector from "@/components/PlanSelector.vue";
import { usePlanList } from "@/composables/usePlanList";

const route = useRoute();
const serviceType = computed(() => route.params.serviceType as string | undefined);
const { plans, loading, error } = usePlanList(() => serviceType.value);
</script>
