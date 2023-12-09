<script setup lang="ts">
import { ref } from 'vue';
import { useProfilerStore } from '@/stores/profiler.store';
import { useRouter } from 'vue-router';
import FileDragZone from '@/components/FileDragZone.vue';
import ProgressSpinner from 'primevue/progressspinner';

const profilerStore = useProfilerStore();
const router = useRouter();

const file = ref<File | null>(null);
const isLoading = ref(false);

const onFilesSelected = (files: File[]) => {
  file.value = files[0];
  isLoading.value = true;

  // read file contents as JSON
  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target?.result as string;

    const profilingSession = JSON.parse(contents);
    profilerStore.setProfilingSession(profilingSession);

    // redirect to results overview
    router.push('/overview');

    isLoading.value = false;
  };
  reader.readAsText(files[0]);
};
</script>

<template>
  <main>
    <div class="drag-zone">
      <h1>WPF Dispatcher Profiler</h1>

      <file-drag-zone
        v-if="!isLoading"
        upload-text="Drag and drop a JSON file here, or click to select a file"
        :multiple="false"
        accept="application/json"
        @select="onFilesSelected"
      />
      <div v-else class="loading-container">
        <progress-spinner animation-duration="1s" stroke-width="3px" />
        <div>Loading...</div>
        <div><strong>TIP:</strong> Try to keep profiling sessions short and focused</div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.drag-zone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #4b5563;
  min-width: min(600px, 90vw);
  aspect-ratio: 6 / 4;
}
</style>
