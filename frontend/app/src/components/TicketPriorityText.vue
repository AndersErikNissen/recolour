<script setup>
import { computed } from 'vue';
import { useColourStore } from '@/stores/colours.js';

const colourStore = useColourStore();
const priorityColours = computed(() => colourStore.priorityColours);
defineProps({
  tag: {
    type: String,
    default: "div",
  },
  priority: {
    type: String,
    default: 'low',
  }
});
</script>

<template>
  <component :is="tag" class="flex gap-1 items-center font-mono uppercase">
    <span class="block size-1.5 bg-current rounded-full" :class="priorityColours.text[priority]"></span>
    <slot />
  </component>
</template>