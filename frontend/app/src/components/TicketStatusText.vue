<script setup>
import { computed } from 'vue';
import { useColourStore } from '@/stores/colours.js';

const colourStore = useColourStore();
const statusColours = computed(() => colourStore.statusColours);
defineProps({
  tag: {
    type: String,
    default: "div",
  },
  status: {
    type: String,
    default: 'pending',
  }
});
</script>

<template>
  <component :is="tag" class="flex gap-1 items-center font-mono uppercase">
    <span class="block size-1.5 bg-current rounded-full" :class="statusColours.text[status]"></span>
    <slot />
  </component>
</template>