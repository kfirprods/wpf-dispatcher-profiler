<script setup lang="ts">
import { useProfilerStore } from '@/stores/profiler';

const { profilingSession } = useProfilerStore();
</script>

<template>
  <div>
    <h1>{{ profilingSession!.total_run_time }}</h1>
    <p>{{ profilingSession!.exported_at }}</p>
  </div>
</template>
