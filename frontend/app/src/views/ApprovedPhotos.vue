<script setup>
import { onMounted, computed, ref } from 'vue';
import { useTicketStore } from '@/stores/tickets.js';
import { imageUrl } from '@/utils/image';

const ticketStore = useTicketStore();

const statusColours = computed(() => colourStore.statusColours);

onMounted(() => {
  if (ticketStore.tickets.length === 0) {
    ticketStore.fetchTickets();
  }
});

const approvedPhotos = computed(() => {
  const photos = [];

  ticketStore.completedTickets.forEach((ticket) => {
    ticket?.images?.recolours.forEach((image) => {
      photos.push(image);
    });
  });

  return photos;
});
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Approved photos ({{ approvedPhotos.length }})</h1>
      <p class="text-brand-800 mt-1 max-w-md">
        Below you can find all the recoloured images from approved tickets.
      </p>
    </div>

    <ul class="rounded-xl grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 font-mono gap-1" v-if="approvedPhotos.length > 0">
      <li v-for="photo in approvedPhotos" :key="photo.path" class="rounded-xl bg-brand-100">
        <img class="rounded-t-xl w-full h-auto" :src="imageUrl(photo.path)" />
        <span class="block text-xs p-2"><span class="text-brand-400">From ticket:</span> #{{ photo.ticket_id }}</span>
      </li>
    </ul>

    <div v-else class="col-span-full bg-brand-600 text-brand-50 rounded-2xl">
      <p class="py-10 px-5 text-xs text-center">There are currently no approved photos, try again later!</p>
    </div>
  </div>
</template>
