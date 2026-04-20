<template>
  <div class="page">
    <div class="statusMessage errorState">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>
