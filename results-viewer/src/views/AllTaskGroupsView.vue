<script setup lang="ts">
import Card from 'primevue/card';

import { useProfilerStore } from '@/stores/profiler.store';
import GroupedTasksDataTable from '@/components/GroupedTasksDataTable.vue';
import { computed } from 'vue';

const { groupedTasks } = useProfilerStore();

const displayedTasks = computed(() => {
  return [...groupedTasks];
});
</script>

<template>
  <div class="container">
    <div class="overview-container">
      <router-link to="/overview" class="navigation-link">← Back to overview</router-link>

      <Card>
        <template #title>All task groups ({{ groupedTasks.length }})</template>

        <template #content>
          <grouped-tasks-data-table
            :tasks="displayedTasks"
            sortable
            show-average-priority
            show-group-size
            :animate-numbers="false"
          />
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
