<script setup>
defineProps({
  tag: {
    type: String,
    default: "button",
  },
});
</script>

<template>
  <component :is="tag" class="p-3 px-5 rounded-full bg-brand-300 text-brand-950 flex gap-2 justify-center items-center text-xs font-mono uppercase">
    <slot />
  </component>
</template>