<script setup lang="ts">
import { ref } from 'vue';
import { type ProfilingSession } from '@/types';

const file = ref<File | null>(null);
const profilingSession = ref<ProfilingSession | null>(null);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files as FileList;
  file.value = files[0];

  // read file contents as JSON
  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target?.result as string;

    profilingSession.value = JSON.parse(contents);
  };
  reader.readAsText(files[0]);
};
</script>

<template>
  <main>
    <div v-if="!profilingSession">
      <label>Drag a JSON file here</label>
      <input type="file" @change="onFileChange" multiple="false" accept=".json" />
    </div>
    <div v-else>
      <h1>{{ profilingSession.total_run_time }}</h1>
      <p>{{ profilingSession.exported_at }}</p>
    </div>
  </main>
</template>
