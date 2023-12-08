<script setup lang="ts">
import { ref } from 'vue';
import { useProfilerStore } from '@/stores/profiler.store';
import { useRouter } from 'vue-router';

const file = ref<File | null>(null);
const profilerStore = useProfilerStore();
const router = useRouter();

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files as FileList;
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
      <label>Drag a JSON file here</label>
      <input type="file" @change="onFileChange" multiple="false" accept=".json" />
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
@/stores/profiler.store
