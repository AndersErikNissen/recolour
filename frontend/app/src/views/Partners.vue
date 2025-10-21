<script setup>
import { onMounted, computed, ref } from 'vue';
import { usePartnerStore } from '@/stores/partners';

const partnerStore = usePartnerStore();

onMounted(() => {
  if (partnerStore.partners.length === 0) {
    partnerStore.fetchPartners();
  }
});

const partners = computed(() => partnerStore.partners);
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Our partners</h1>
      <p class="text-brand-800 mt-1 max-w-md">
        Below you will find a simple overview over all our partners.
      </p>
    </div>

    <ul class="rounded-xl grid gap-3 relative">
      <li v-for="partner in partners" :key="partner.name" class="rounded-xl bg-brand-100 flex items-center gap-5 p-3">
        <div v-html="partner.logo" class="partner-logo w-32 flex items-center justify-center aspect-square p-4 rounded-lg bg-amber-50"></div>
        <div class="p-2">
          <h3 class="block text-lg font-bold mb-2 text-brand-500">{{ partner.name }}</h3>
          <span class="block text-xs font-mono text-brand-800"><span>API endpoint:</span> {{ partner.api_endpoint }}</span>
        </div>
      </li>

      <li v-if="partners.length === 0" class="font-mono col-span-full bg-brand-600 text-brand-50 rounded-2xl">
        <p class="py-10 px-5 text-xs text-center">There are currently no approved photos, try again later!</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.partner-logo :deep(svg) {
  display: inline-block;
  width: 100%;
  height: auto;
}
</style>
