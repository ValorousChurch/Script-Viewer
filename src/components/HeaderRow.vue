<template>
  <tr>
    <td class="header" colspan="2"></td>
    <td class="header">{{ title }}</td>
    <td class="header" :colspan="columnCount"></td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  columnCount: number;
}>();
</script>
