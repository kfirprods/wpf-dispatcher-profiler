<script setup lang="ts">
import Card from 'primevue/card';
import { computed } from 'vue';
import HighlightSummary from '@/components/HighlightSummary.vue';
import { useProfilerStore } from '@/stores/profiler.store';
import ConclusionBasedSummary from '@/components/ConclusionBasedSummary.vue';
import { convertMillisecondsToText, convertIso8601ToTimeAgo } from '@/utils';
import AnimatedNumber from '@/components/AnimatedNumber.vue';

const { profilingSession, groupedTasks, longestRunningTasks, longestWaitingTasks } =
  useProfilerStore();

const DEFAULT_PRIORITY = 2;

const topLongestRunningTasks = computed(() => {
  return longestRunningTasks.slice(0, 5).map((taskGroup) => ({
    origin_name: taskGroup.origin_name,
    time: taskGroup.accumulated_actual_run_time
  }));
});

const topLongestWaitingTasks = computed(() => {
  return longestWaitingTasks.slice(0, 5).map((taskGroup) => ({
    origin_name: taskGroup.origin_name,
    time: taskGroup.accumulated_time_in_queue
  }));
});

const redundantTasks = computed(() => {
  return groupedTasks.filter((taskGroup) => taskGroup.are_all_tasks_redundant).slice(0, 10) ?? [];
});

const redundantTasksTotalQueueTime = computed(() => {
  return redundantTasks.value.reduce(
    (acc, taskGroup) => acc + taskGroup.accumulated_time_in_queue,
    0
  );
});

const prioritizedTasks = computed(() => {
  return groupedTasks
    .filter(
      (taskGroup) =>
        taskGroup.average_priority > DEFAULT_PRIORITY && taskGroup.average_actual_run_time > 2
    )
    .slice(0, 10);
});
</script>

<template>
  <div class="container">
    <div class="overview-container">
      <h1>Profiling Session Overview</h1>
      <h5>
        <animated-number :number="profilingSession!.tasks.length" /> tasks recorded over
        {{ convertMillisecondsToText(profilingSession!.total_run_time) }}
        • Exported {{ convertIso8601ToTimeAgo(profilingSession!.exported_at) }}
      </h5>

      <Card>
        <template #title>Top 5s</template>

        <template #content>
          <div class="highlights-container">
            <highlight-summary
              title="Longest total runtime on UI thread"
              :tasks="topLongestRunningTasks"
            />

            <highlight-summary
              title="Longest total wait time in dispatcher queue"
              :tasks="topLongestWaitingTasks"
            />
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Highlights</template>

        <template #content>
          <div class="conclusion-summaries-container">
            <conclusion-based-summary
              title="Redundant dispatching"
              description="Tasks that were dispatched from the UI thread, in which case dispatching is probably redundant and the task can run directly in the same context."
              :tasks="redundantTasks"
              :comment="`${redundantTasksTotalQueueTime}ms wasted waiting in queue`"
            />

            <conclusion-based-summary
              title="Prioritized tasks"
              description="Tasks that were given higher priority (excludes tasks that only ran for <2ms). Priority should be set carefully."
              :tasks="prioritizedTasks"
              comment=""
              show-average-priority
              show-group-size
            />
          </div>
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

h1,
h5 {
  margin: 0;
  padding: 0;
}

.highlights-container {
  display: flex;
  justify-content: space-between;
}

.conclusion-summaries-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.conclusion-summaries-container > * {
  padding: 1rem 0;
}

.conclusion-summaries-container > *:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
}
</style>
