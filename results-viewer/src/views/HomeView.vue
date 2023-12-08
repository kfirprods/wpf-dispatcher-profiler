<script setup lang="ts">
import { ref } from 'vue';
import { useProfilerStore } from '@/stores/profiler.store';
import { useRouter } from 'vue-router';
import FileDragZone from '@/components/FileDragZone.vue';

const file = ref<File | null>(null);
const profilerStore = useProfilerStore();
const router = useRouter();

const onFilesSelected = (files: File[]) => {
  file.value = files[0];

  // read file contents as JSON
  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target?.result as string;

    const profilingSession = JSON.parse(contents);
    profilerStore.setProfilingSession(profilingSession);

    // redirect to results overview
    router.push('/overview');
  };
  reader.readAsText(files[0]);
};
</script>

<template>
  <main>
    <div class="drag-zone">
      <h1>WPF Dispatcher Profiler</h1>

      <file-drag-zone
        upload-text="Drag and drop a JSON file here, or click to select a file"
        :multiple="false"
        accept="application/json"
        @select="onFilesSelected"
      />
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
</style>
