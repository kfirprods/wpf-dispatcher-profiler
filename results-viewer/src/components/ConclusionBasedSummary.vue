<script setup lang="ts">
import { type PropType } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { type GroupedTasks } from '@/types';

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  tasks: {
    type: Object as PropType<GroupedTasks[]>,
    required: true
  },
  showAveragePriority: {
    type: Boolean,
    default: false
  },
  showGroupSize: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="container">
    <div class="text-container">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>

    <div class="table-container">
      <h3 class="comment">{{ tasks.length ? comment : 'No issues found' }}</h3>

      <DataTable v-if="tasks.length" :value="tasks">
        <Column field="origin_name" header="Name">
          <template #body="slotProps">
            <router-link
              :to="{ name: 'task-group', query: { origin_name: slotProps.data.origin_name } }"
            >
              {{ slotProps.data.origin_name }}
            </router-link>
          </template>
        </Column>
        <Column field="accumulated_total_run_time" header="Total Time">
          <template #body="slotProps"> {{ slotProps.data.accumulated_total_run_time }}ms </template>
        </Column>
        <Column field="accumulated_time_in_queue" header="Wait Time">
          <template #body="slotProps"> {{ slotProps.data.accumulated_time_in_queue }}ms </template>
        </Column>
        <Column field="accumulated_actual_run_time" header="Run Time">
          <template #body="slotProps">
            {{ slotProps.data.accumulated_actual_run_time }}ms
          </template>
        </Column>
        <Column v-if="showAveragePriority" field="average_priority" header="Avg. Priority">
          <template #body="slotProps"> {{ slotProps.data.average_priority }} </template>
        </Column>
        <Column v-if="showGroupSize" header="Count">
          <template #body="slotProps"> {{ slotProps.data.tasks.length }} </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 1rem;
}

.text-container {
  flex-shrink: 0;
  width: max(300px, 30%);
}

.table-container {
  flex: 1;
}

h3 {
  margin: 0;
  padding: 0;
}

h3.comment {
  font-weight: 400;
  font-size: 0.8rem;
}
</style>
