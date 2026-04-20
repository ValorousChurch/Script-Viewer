<template>
  <div class="page">
    <div class="statusMessage">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
