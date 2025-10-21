<script setup>
defineProps({
  tag: {
    type: String,
    default: "button",
  },
});
</script>

<template>
  <component :is="tag" class="p-3 px-5 rounded-full cursor-pointer text-brand-950 flex gap-2 justify-center items-center text-xs font-mono uppercase bg-brand-300 hover:bg-brand-400 transition duration-300 active:scale-95">
    <slot />
  </component>
</template>