<script setup>
import FilledButton from './components/FilledButton.vue';
import GlobalHeader from './components/GlobalHeader.vue';
</script>

<template>
  <div class="bg-brand-50 min-h-screen p-3 text-brand-950 flex gap-4 font-sans relative">
    <GlobalHeader />
  
    <main class="relative grow">
      <RouterView />

      <div class="fixed bottom-3 right-3 z-10">
        <FilledButton tag="RouterLink" activeClass="hidden" to="/tickets/create">
          <span class="text-sm font-bold bg-brand-900 text-brand-50 rounded-full flex justify-center items-center size-5">+</span>
          <span>Create ticket</span>
        </FilledButton>
      </div>
    </main>
  </div>
</template>
