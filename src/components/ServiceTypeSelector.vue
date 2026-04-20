<template>
  <div class="page">
    <div class="typeSelector">
      <p>To begin, please select a service type.</p>
      <RouterLink
        v-for="serviceType in serviceTypeOptions"
        :key="serviceType.id"
        :to="{ name: 'plan-list', params: { serviceType: serviceType.id } }"
      >
        {{ serviceType.label }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { serviceTypeOptions } from "@/config/planTemplates";
</script>
