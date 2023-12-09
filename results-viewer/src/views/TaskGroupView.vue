<script setup lang="ts">
import Card from 'primevue/card';
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, type RouteLocationNormalized } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useProfilerStore } from '@/stores/profiler.store';
import type { ProfiledTask } from '@/types';
import { convertBooleanToText, convertDispatcherPriorityToText } from '@/utils';

const route = useRoute();
const profilerStore = useProfilerStore();
let fromRoute = ref<RouteLocationNormalized | null>(null);

const groupedTask = computed(() =>
  profilerStore.groupedTasks.find((group) => group.origin_name === route.query.origin_name)
);

interface DisplayedTask extends ProfiledTask {
  order: number;
}

function iso8601ToSeconds(iso8601Timestamp: string) {
  return new Date(iso8601Timestamp).getTime();
}

onBeforeMount(() => {
  fromRoute.value = route.meta.from as RouteLocationNormalized;
});

const displayedTasks = computed(() => {
  if (!groupedTask.value) {
    return [];
  }

  return [...groupedTask.value.tasks]
    .sort((a, b) => iso8601ToSeconds(a.created_at) - iso8601ToSeconds(b.created_at))
    .map((task, index) => ({
      ...task,
      order: index + 1
    }));
});

const fromRouteDisplayName = computed(() => {
  if (!fromRoute.value) {
    return '';
  }

  return fromRoute.value.name?.toString().replace(/-/g, ' ');
});
</script>

<template>
  <div class="container">
    <div class="overview-container">
      <router-link v-if="fromRoute" :to="fromRoute.path" class="navigation-link"
        >← Back to {{ fromRouteDisplayName }}</router-link
      >

      <Card>
        <template #title
          >{{ groupedTask!.origin_name }} tasks ({{ groupedTask!.tasks.length }})</template
        >

        <template #content>
          <DataTable
            :value="displayedTasks"
            paginator
            :rows="50"
            :rowsPerPageOptions="[50, 100, 250]"
          >
            <Column field="order" header="Order" sortable></Column>
            <Column field="total_run_time" header="Total Time" sortable>
              <template #body="slotProps"> {{ slotProps.data.total_run_time }}ms </template>
            </Column>
            <Column field="time_in_queue" header="Wait Time" sortable>
              <template #body="slotProps"> {{ slotProps.data.time_in_queue }}ms </template>
            </Column>
            <Column field="actual_run_time" header="Run Time" sortable>
              <template #body="slotProps"> {{ slotProps.data.actual_run_time }}ms </template>
            </Column>
            <Column field="priority" header="Priority" sortable>
              <template #body="slotProps">
                {{ convertDispatcherPriorityToText(slotProps.data.priority) }}
              </template>
            </Column>
            <Column field="is_probably_redundant" header="Probably Redundant?" sortable>
              <template #body="slotProps">
                {{ convertBooleanToText(slotProps.data.is_probably_redundant) }}
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.overview-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1400px;
}
</style>
