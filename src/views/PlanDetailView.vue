<template>
  <LoadingState v-if="loading" message="loading..." />
  <ErrorState v-else-if="error" :message="error" />
  <template v-else-if="plan">
    <TemplateSelector
      :active-template-name="templateName"
      :service-type="plan.serviceType"
      :plan-id="plan.planId"
    />
    <div class="page">
      <header>
        <small>{{ versionText }}</small>
        <br />
        <b>PRODUCTION SCRIPT: {{ titleText }}</b>
      </header>
      <table>
        <thead>
          <tr>
            <th width="5%">Clock</th>
            <th width="5%">Time</th>
            <th width="45%" class="alignLeft">Element</th>
            <th
              v-for="column in template.columns"
              :key="column.title"
              :width="`${45 / template.columns.length}%`"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in rows" :key="row.id">
            <HeaderRow
              v-if="row.type === 'header'"
              :title="row.title"
              :column-count="template.columns.length"
            />
            <ItemRow v-else :row="row" />
          </template>
        </tbody>
      </table>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ErrorState from "@/components/ErrorState.vue";
import HeaderRow from "@/components/HeaderRow.vue";
import ItemRow from "@/components/ItemRow.vue";
import LoadingState from "@/components/LoadingState.vue";
import TemplateSelector from "@/components/TemplateSelector.vue";
import { usePlanDetails } from "@/composables/usePlanDetails";

const route = useRoute();

const serviceType = computed(() => route.params.serviceType as string | undefined);
const planId = computed(() => route.params.planId as string | undefined);
const templateParam = computed(() => route.params.type as string | undefined);

const { plan, loading, error, template, templateName, rows, versionText, titleText } =
  usePlanDetails(
    () => serviceType.value,
    () => planId.value,
    () => templateParam.value,
  );
</script>
