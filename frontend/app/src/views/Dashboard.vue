<script setup>
import { onMounted, computed } from 'vue';
import { useTicketStore } from '@/stores/tickets.js';
import { useColourStore } from '@/stores/colours.js';
import TicketStatusText from '@/components/TicketStatusText.vue';

const dashboardTopics = ['Ticket destribution', 'Latest ticket(s)'];

const ticketStore = useTicketStore();
const colourStore = useColourStore();

onMounted(() => {
  if (ticketStore.tickets.length === 0) {
    ticketStore.fetchTickets();
  }
});

const ticketDestribution = computed(() => ticketStore.ticketDestribution);
const latestTickets = computed(() => ticketStore.latestTickets);
const statusColours = computed(() => colourStore.statusColours);

</script>

<template>
  <div class="grid gap-3">
    <section class="col-span-full">
      <h1 class="font-bold text-2xl">Welcome to RECOLOUR!</h1>
      <p class="text-brand-800 mt-1 max-w-md">Here on your dashboard, you will be able to get a better overview over the current set of tickets.</p>
    </section>

    <section class="grid lg:grid-cols-2 gap-3 mt-6">
      <div v-for="topic in dashboardTopics" class="bg-brand-100 rounded-xl p-4" :key="topic">
        <h2 class="text-xl font-bold mb-3 text-brand-500">{{ topic }}</h2>

        <div v-if="topic === 'Ticket destribution'"> 
          <div class="w-full rounded-full flex h-4 overflow-hidden mb-2">
            <div v-for="status in ticketStore.statuses" :key="'1-' + status" class="grow shrink-0 bg-current" :class="statusColours.text[status]" :style="'width:' + ticketDestribution.widths[status] + '%;'"></div>
          </div>

          <ul class="capitalize text-xs">
            <TicketStatusText v-for="status in ticketStore.statuses" :key="'2-' + status" :status="status" tag="li">
              {{ status }} ({{ ticketDestribution.counts[status] }})
            </TicketStatusText>
          </ul>
        </div>

        <div v-else-if="topic === 'Latest ticket(s)'">
          <ul v-if="latestTickets.length > 0" class="grid gap-1">
            <li v-for="ticket in latestTickets" :key="'latest-' + ticket.id" class="flex justify-between items-center px-3 py-2 rounded-lg border border-current">
              <span>#{{ ticket.id }}</span>

              <TicketStatusText :status="ticket.status">
              <span class="text-xs">{{ ticket.status }}</span>
            </TicketStatusText>
            </li>
          </ul>

          <p v-else class="font-mono text-xs">No active tickets at the moment, try and come back later!</p>
        </div>
      </div>
    </section> 
  </div>
</template>