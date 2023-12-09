<script setup lang="ts">
import { type PropType } from 'vue';
import { type GroupedTasks } from '@/types';

import GroupedTasksDataTable from './GroupedTasksDataTable.vue';

defineProps({
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
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
    <div v-if="title && description" class="text-container">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>

    <div class="table-container">
      <h3 class="comment">{{ tasks.length ? comment : 'No issues found' }}</h3>

      <grouped-tasks-data-table
        :tasks="tasks"
        :show-average-priority="showAveragePriority"
        :show-group-size="showGroupSize"
      />
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
  overflow-x: auto;
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
