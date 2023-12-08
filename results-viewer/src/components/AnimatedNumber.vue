<script setup lang="ts">
import { onMounted, ref } from 'vue';
// @ts-ignore
import TWEEN from '@tweenjs/tween.js';

const props = defineProps({
  number: {
    type: Number,
    required: true
  },
  startAt: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 1000
  },
  suffix: {
    type: String,
    default: ''
  }
});

const displayedNumber = ref(0);

onMounted(() => {
  new TWEEN.Tween({ displayedNumber: props.startAt })
    .to({ displayedNumber: props.number }, props.duration)
    .onUpdate((object: any) => {
      displayedNumber.value = Math.round(object.displayedNumber);
    })
    .start();
  requestAnimationFrame(animate);
});

function animate(time: number) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}
</script>

<template>
  <span> {{ displayedNumber }}{{ suffix }} </span>
</template>
