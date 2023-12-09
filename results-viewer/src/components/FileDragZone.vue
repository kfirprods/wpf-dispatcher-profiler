<script setup lang="ts">
import { ref } from 'vue';

const inputFile = ref<HTMLInputElement | null>(null);

defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: undefined
  },
  uploadText: {
    type: String,
    default: 'Drag and drop a file here, or click to select a file'
  }
});

const emits = defineEmits({
  select: (files: File[]) => true
});

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files as FileList;

  emits('select', Array.from(files));
};

function selectFiles() {
  inputFile.value?.click();
}

const onDrop = (event: DragEvent) => {
  event.preventDefault();

  if (!event.dataTransfer) {
    return;
  }

  const files = Array.from(event.dataTransfer.files);
  emits('select', files);
};
</script>

<template>
  <div
    class="container flex align-items-center justify-content-center flex-column"
    @click="selectFiles()"
    @dragover.prevent
    @drop="onDrop"
  >
    <i class="pi pi-upload border-2 border-circle p-3 text-8xl text-400 border-400" />
    <p class="mt-4 mb-0">{{ uploadText }}</p>
  </div>

  <input ref="inputFile" type="file" @change="onFileChange" :multiple="multiple" :accept="accept" />
</template>

<style scoped>
.container {
  background: white;
  color: #4b5563;
  border-radius: 6px;
  border: 2px dashed #e0e0e0;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
  min-width: min(600px, 90vw);
  aspect-ratio: 6 / 4;
  justify-content: center;
}

input[type='file'] {
  display: none;
}

/* i hate tailwind lol */
.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.flex-1 {
  flex: 1;
}

.gap-2 {
  gap: 2rem;
}

.flex-column {
  flex-direction: column;
}

.border-2 {
  border-width: 2px;
  border-style: solid;
}

.border-circle {
  border-radius: 50%;
}

.p-3 {
  padding: 3rem;
}

.text-8xl {
  font-size: 8rem;
}

.text-400 {
  font-weight: 400;
}

.border-400 {
  border-color: #cbd5e0; /* This is a guess, as Tailwind doesn't have a border-400 class */
}

.mt-4 {
  margin-top: 1rem;
}

.mb-0 {
  margin-bottom: 0;
}
</style>
