<script setup lang="ts">
import type { PropType } from 'vue';
import { RouterLink } from 'vue-router';
import AnimatedNumber from './AnimatedNumber.vue';

interface TaskSummary {
  origin_name: string;
  time: number;
}

defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array as PropType<TaskSummary[]>,
    required: true
  }
});
</script>

<template>
  <div class="highlight">
    <h3 class="highlight-title">{{ title }}</h3>
    <div class="highlight-list-container">
      <template v-for="(task, index) in tasks" :key="index">
        <div class="time">
          <animated-number suffix="ms" :number="task.time" />
        </div>
        <div class="name">
          <router-link :to="{ name: 'task-group', query: { origin_name: task.origin_name } }">
            {{ task.origin_name }}
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.highlight-list-container {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.3rem 0.5rem;
}

.highligh-list-item {
  padding: 0.5rem 1rem;
  gap: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.time {
  flex-shrink: 0;
  font-weight: 300;
  color: #666;
}

.name {
  flex-grow: 1;
}
</style>
