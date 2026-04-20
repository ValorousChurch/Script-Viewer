<template>
  <tr>
    <td>{{ row.clockDisplay }}</td>
    <td>{{ row.lengthDisplay }}</td>
    <td class="elementCell">
      <b>{{ row.title }}</b>
      <br />
      <span v-html="safeDescriptionHtml"></span>
    </td>
    <td
      v-for="(columnHtml, index) in row.noteColumns"
      :key="`${row.id}-${index}`"
      class="note"
      v-html="sanitizeHtml(columnHtml)"
    ></td>
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
