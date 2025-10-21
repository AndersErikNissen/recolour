<script setup>
import { onMounted, computed, ref } from 'vue';
import { useTicketStore } from '@/stores/tickets.js';
import { useColourStore } from '@/stores/colours.js';
import TicketStatusText from '@/components/TicketStatusText.vue';
import TicketPriorityText from '@/components/TicketPriorityText.vue';
import FilledButton from '@/components/FilledButton.vue';

const ticketStore = useTicketStore();
const colourStore = useColourStore();

const statusColours = computed(() => colourStore.statusColours);

onMounted(() => {
  if (ticketStore.tickets.length === 0) {
    ticketStore.fetchTickets();
  }
});

const tableHeadings = ['ID', 'Style', 'Partner', 'Priority', 'Status', 'Action(s)'];
const statuses = ['pending', 'sent', 'in progress', 'completed', 'rejected'];

const filters = ref({
  status: '',
  partner: '',
});

const filteredTickets = computed(() => {
  return ticketStore.tickets.filter((ticket) => {
    const matchesStatus = !filters.value.status || ticket.status === filters.value.status;
    const matchesPartner = !filters.value.partner || ticket.partner === filters.value.partner;
    return matchesStatus && matchesPartner;
  });
});

const partners = computed(() => {
  return [...new Set(ticketStore.tickets.map((ticket) => ticket.partner))];
});

const resetFilters = () => {
  filters.value.status = '';
  filters.value.partner = '';
};

const toast = ref(null);

const showToaster = (data, type = 'success') => {
  toast.value = { data, type };

  setTimeout(() => (toast.value = null), 4000);
};

const sendTicketToPartner = async (ticketId) => {
  try {
    const data = await ticketStore.sendTicket(ticketId);
    showToaster(data, 'success');
  } catch (err) {
    showToaster({message: `Error sending ticket: ${err.message}`}, 'error');
  }
};
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Ticket Queue</h1>
      <p class="text-brand-800 mt-1 max-w-md">
        Here you can get an overview over all the tickets, and have the ability to find specific tickets using the available filters.
      </p>
    </div>

    <div class="rounded-xl bg-brand-200 p-3 mb-3">
      <span class="text-xs block mb-1 text-brand-700">Filters</span>
      <div class="flex flex-wrap gap-3 items-center">
        <select
          id="filter"
          v-model="filters.status"
          class="text-brand-950 border-current text-xs font-mono uppercase border rounded-full px-3 py-1 focus:ring inline-block h-8 appearance-none cursor-pointer"
        >
          <option value="">All statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status.toUpperCase() }}
          </option>
        </select>
  
        <select
          id="partner"
          v-model="filters.partner"
          class="text-brand-950 border-current text-xs font-mono uppercase border rounded-full px-3 py-1 focus:ring inline-block h-8 appearance-none cursor-pointer"
        >
          <option value="">All Partners</option>
          <option v-for="partner in partners" :key="partner" :value="partner">
            {{ partner }}
          </option>
        </select>
        
        <div class="flex justify-end grow">
          <FilledButton @click="resetFilters">
            Reset
          </FilledButton>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto bg-brand-100 rounded-xl">
      <table class="min-w-full text-left border-collapse">
        <thead class="bg-brand-200 border-b border-brand-950 font-mono uppercase text-xs">
          <tr>
            <th v-for="(heading, index) in tableHeadings" :key="heading" class="px-4 py-3" :class="{ 'text-right': index === tableHeadings.length - 1 }">
              {{ heading }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            class="hover:bg-brand-200 transition rounded-lg font-mono text-sm uppercase"
          >
            <td class="px-4 py-3 font-sans font-bold">#{{ ticket.id }}</td>
            <td class="px-4 py-3 font-sans">{{ ticket.style }}</td>
            <td class="px-4 py-3 font-sans">{{ ticket.partner }}</td>
            <td class="px-4 py-3">
              <TicketPriorityText :priority="ticket.priority">
                <span class="text-xs">
                  {{ ticket.priority }}
                </span>
              </TicketPriorityText>
            </td>
            <td class="px-4 py-3">
              <TicketStatusText :status="ticket.status">
                <span class="text-xs">
                  {{ ticket.status }}
                </span>
              </TicketStatusText>
            </td>
            <td class="px-4 py-3">
              <div  class="flex flex-wrap items-center gap-1 font-mono text-xs justify-end">
                <span v-if="ticket.status === 'pending'" @click="sendTicketToPartner(ticket.id)" :class="[statusColours.text['sent']]" class="cursor-pointer decoration-current underline">
                  Send
                </span>
                
                <template v-if="ticket.status === 'in progress'">
                  <span @click="ticketStore.updateTicketStatus(ticket.id, 'completed')" :class="[statusColours.text['completed']]" class="cursor-pointer decoration-current underline">
                    Complete
                  </span>
                  <span>/</span>
                  <span @click="ticketStore.updateTicketStatus(ticket.id, 'rejected')" :class="[statusColours.text['rejected']]" class="cursor-pointer decoration-current underline">
                    Reject
                  </span>
                </template>

                <span v-else-if="ticket.status === 'completed'" @click="ticketStore.updateTicketStatus(ticket.id, 'in progress')" class="cursor-pointer decoration-current underline">
                  Reverse
                </span>

                <span v-else-if="ticket.status === 'rejected'" @click="sendTicketToPartner(ticket.id)" :class="[statusColours.text['sent']]" class="cursor-pointer decoration-current underline">
                  Resend
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Transition>
      <div v-if="toast" class="fixed bottom-3 left-[50%] -translate-x-[50%] p-5 rounded-xl bg-brand-200 max-w-sm">
        <div v-if="toast.type === 'success'" class="flex justify-center items-center flex-col gap-3">
          <div class="p-4 bg-brand-50 rounded-lg">
            <div class="w-32 toaster-icon" v-html="toast.data.partner.logo"></div>
          </div>

          <div class="text-center">
            <p>
              Ticket has been sent to <span class="text-bold">{{ toast.data.partner.name }}</span>, via <a class="underline" :href="toast.data.partner.api_endpoint">{{ toast.data.partner.api_endpoint }}</a>
            </p>
            <p class="mt-4 italic">The partner will get started on the ticket in <span class="text-bold">{{ toast.data.delay / 1000 }}s, and change the status to "In progress"</span></p>
          </div>
        </div>
        <p v-else>{{ toast.data.message }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toaster-icon :deep(svg) {
  display: inline-block;
  width: 100%;
  height: auto;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 300ms ease, transform 300ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
