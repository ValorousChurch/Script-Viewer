<template>
  <tr>
    <td>{{ row.clockDisplay }}</td>
    <td>{{ row.lengthDisplay }}</td>
    <td class="elementCell">
      <b>{{ row.title }}</b>
      <br />
      <!-- eslint-disable vue/no-v-html -->
      <!-- HTML is sanitized through sanitizeHtml before rendering. -->
      <span v-html="safeDescriptionHtml"></span>
      <!-- eslint-enable vue/no-v-html -->
    </td>
    <!-- eslint-disable vue/no-v-html -->
    <!-- Template note HTML is sanitized through sanitizeHtml before rendering. -->
    <td
      v-for="(columnHtml, index) in row.noteColumns"
      :key="`${row.id}-${index}`"
      class="note"
      v-html="sanitizeHtml(columnHtml)"
    ></td>
    <!-- eslint-enable vue/no-v-html -->
  </tr>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PlanRow } from "@/types/plans";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

const props = defineProps<{
  row: PlanRow;
}>();

const safeDescriptionHtml = computed(() => sanitizeHtml(props.row.descriptionHtml));
</script>
