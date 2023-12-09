<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import type { GroupedTasks } from '@/types';
import type { PropType } from 'vue';
import { convertDispatcherPriorityToText } from '@/utils';
import AnimatedNumber from '@/components/AnimatedNumber.vue';

defineProps({
  tasks: {
    type: Array as PropType<GroupedTasks[]>,
    required: true
  },
  showAveragePriority: {
    type: Boolean,
    default: false
  },
  showGroupSize: {
    type: Boolean,
    default: false
  },
  sortable: {
    type: Boolean,
    default: false
  },
  animateNumbers: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <DataTable
    v-if="tasks.length"
    :value="tasks"
    sort-field="accumulated_total_run_time"
    :sort-order="-1"
  >
    <Column field="origin_name" header="Name" :sortable="sortable">
      <template #body="slotProps">
        <router-link
          :to="{ name: 'task-group', query: { origin_name: slotProps.data.origin_name } }"
        >
          {{ slotProps.data.origin_name }}
        </router-link>
      </template>
    </Column>
    <Column field="accumulated_total_run_time" header="Total Time" :sortable="sortable">
      <template #body="slotProps">
        <animated-number
          :enabled="animateNumbers"
          suffix="ms"
          :number="slotProps.data.accumulated_total_run_time"
        />
      </template>
    </Column>
    <Column field="accumulated_time_in_queue" header="Wait Time" :sortable="sortable">
      <template #body="slotProps">
        <animated-number
          :enabled="animateNumbers"
          suffix="ms"
          :number="slotProps.data.accumulated_time_in_queue"
        />
      </template>
    </Column>
    <Column field="accumulated_actual_run_time" header="Run Time" :sortable="sortable">
      <template #body="slotProps">
        <animated-number
          :enabled="animateNumbers"
          suffix="ms"
          :number="slotProps.data.accumulated_actual_run_time"
        />
      </template>
    </Column>
    <Column
      v-if="showAveragePriority"
      field="average_priority"
      header="Avg. Priority"
      :sortable="sortable"
    >
      <template #body="slotProps">
        {{ convertDispatcherPriorityToText(slotProps.data.average_priority) }}
      </template>
    </Column>
    <Column v-if="showGroupSize" header="Count" :field="(d) => d.tasks.length" :sortable="sortable">
      <template #body="slotProps">
        <animated-number :enabled="animateNumbers" :number="slotProps.data.tasks.length" />
      </template>
    </Column>
  </DataTable>
</template>
