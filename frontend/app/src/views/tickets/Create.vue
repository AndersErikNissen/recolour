<script setup>
import { onMounted, computed, ref } from 'vue';
import { usePartnerStore } from '@/stores/partners';
import { usePhotoStore } from '@/stores/photos';
import { useTicketStore } from '@/stores/tickets';
import { useColourStore } from '@/stores/colours.js';
import { imageUrl } from '@/utils/image';
import FilledButton from '@/components/FilledButton.vue';

const colourStore = useColourStore();
const ticketStore = useTicketStore();
const partnerStore = usePartnerStore();
const photoStore = usePhotoStore();

onMounted(() => {
  if (partnerStore.partners.length === 0) {
    partnerStore.fetchPartners();
  }
  
  if (photoStore.counts.available === 0) {
    photoStore.fetchAvailablePhotos();
  }
});

const partners = computed(() => partnerStore.partners);
const photos = computed(() => photoStore.photos.available);
const priorityColours = computed(() => colourStore.priorityColours);

const priorities = ['low', 'medium', 'high'];

const createTicketButtonLabel = ref('Create ticket');

const form = ref({
  style: '',
  priority: '',
  partner: '',
  description: '',
  photos: {
    tickets: [],
    attachments: [],
    recolours: [],
  },
});

const createTicket = async () => {
  console.log("FORM.VALUE", form.value);
  const createdTicket = await ticketStore.addTicket(form.value);

  createTicketButtonLabel.value = `Ticket #${createdTicket.id} created!`;
  
  setTimeout(() => {
    resetForm();
    createTicketButtonLabel.value = 'Create another ticket';
  }, 5000);
}

const resetForm = () => {
  for (const key in form.value) {
    if (key === 'photos') {
      form.value[key] = {
        tickets: [],
        attachments: [],
        recolours: [],
      };
    } else {
      form.value[key] = '';
    }
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Create ticket</h1>
      <p class="text-brand-800 mt-1 max-w-md">
        Here you can create your own ticket with all the needed information.
      </p>
    </div>
  
    <form @submit.prevent="createTicket" class="text-xs">
      <div class="rounded-2xl bg-brand-100 p-4">
        <h2 class="font-bold text-lg mb-4 text-brand-800">Data</h2>
        
        <div>
          <label class="block mb-2 font-bold text-brand-600">Description</label>
          <textarea id="description" v-model="form.description" placeholder="Write a description..." class="font-mono p-5 py-3 bg-brand-200 w-full rounded-lg" rows="6"></textarea>
        </div>

        <div class="mt-4">
        <label class="block mb-2 font-bold text-brand-600">Style</label>
        <input id="style" v-model="form.style" placeholder="What is the style..." class="font-mono bg-brand-200 p-5 py-3 w-full rounded-full" />
        </div>

        <div class="mt-4">
        <label class="block mb-2 font-bold text-brand-600">Priority</label>

        <div class="flex flex-wrap gap-1">
          <button v-for="priority in priorities" class="relative min-w-20 rounded-full py-3 px-1.5 bg-current uppercase border border-transparent has-checked:border-brand-950" :class="[priorityColours.text[priority]]">
            <span class="font-mono text-brand-50">{{ priority }}</span>
            <input v-model="form.priority" class="absolute size-full opacity-0 top-0 left-0" :id="'priority-' + priority" :name="'priority-' + priority" :value="priority" type="radio" />
          </button>
        </div>
        </div>

        <div class="mt-4">
        <label class="block mb-2 font-bold text-brand-600">Partner</label>

        <div class="flex flex-wrap gap-1">
          <button v-for="partner in partners" class="relative p-2 rounded-sm bg-amber-50 uppercase border border-transparent has-checked:border-brand-950">
            <div class="partner-logo size-12 flex justify-center items-center" v-html="partner.logo"></div>
            <input v-model="form.partner" class="absolute size-full opacity-0 top-0 left-0" :id="partner.name" :name="partner.name" :value="partner.name" type="radio" />
          </button>
        </div>
        </div>
      </div>

    <div class="rounded-2xl bg-brand-100 p-4 mt-5">
      <h2 class="font-bold text-lg mb-4 text-brand-800">Uploads</h2>

      <div>
        <label class="block mb-2 font-bold text-brand-600">Select uploaded photo(s)</label>

        <ul class="grid gap-1 grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 max-h-80 overflow-y-scroll">
          <li v-for="photo in photos.tickets" class="relative border border-transparent has-checked:border-brand-950 bg-white rounded-lg overflow-hidden">
            <img class="aspect-square object-contain" :src="imageUrl(photo.path)" :alt="photo.name" />
            <input v-model="form.photos.tickets" class="absolute size-full opacity-0 top-0 left-0" :id="photo.name" :name="photo.name" :value="photo" type="checkbox" />
          </li>
        </ul>
      </div>

      <div class="mt-4">
        <label class="block mb-2 font-bold text-brand-600">Select attachment(s)</label>

        <ul class="grid gap-1 grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 max-h-80 overflow-y-scroll">
          <li v-for="photo in photos.attachments" class="relative border border-transparent has-checked:border-brand-950 bg-white rounded-lg overflow-hidden">
            <img class="aspect-square object-contain" :src="imageUrl(photo.path)" :alt="photo.name" />
            <input v-model="form.photos.attachments" class="absolute size-full opacity-0 top-0 left-0" :id="photo.name" :name="photo.name" :value="photo" type="checkbox" />
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-5 bg-brand-500 rounded-2xl p-5">
      <h2 class="font-bold text-lg mb-4 text-brand-800">Upload as "partner"</h2>

      <div>
        <label class="block mb-2 font-bold text-brand-800">Select "recoloured" photo(s)</label>
  
        <ul class="grid gap-1 grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 max-h-80 overflow-y-scroll">
          <li v-for="photo in photos.recolours" class="relative border border-transparent has-checked:border-brand-950 bg-white rounded-lg overflow-hidden">
            <img class="aspect-square object-contain" :src="imageUrl(photo.path)" :alt="photo.name" />
            <input v-model="form.photos.recolours" class="absolute size-full opacity-0 top-0 left-0" :id="photo.name" :name="photo.name" :value="photo" type="checkbox" />
          </li>
        </ul>
      </div>
    </div>

    <div class="flex justify-between mt-5">
      <FilledButton type="button" @click="resetForm">
        <span>Reset form</span>
      </FilledButton>
      
      <FilledButton type="submit">
        <span class="text-sm font-bold bg-brand-900 text-brand-50 rounded-full flex justify-center items-center size-5">+</span>
        <span>{{ createTicketButtonLabel }}</span>
      </FilledButton>
    </div>


  </form>
    
  </div>
</template>

<style scoped>
.partner-logo :deep(svg) {
  display: inline-block;
  width: 100%;
  height: auto;
}
</style>