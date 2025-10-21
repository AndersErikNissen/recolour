import { defineStore } from 'pinia';
import { api } from '@/api.js';

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tickets: [],
    loading: false,
    error: null,
    statuses: ['pending', 'sent', 'in progress', 'completed', 'rejected'],
  }),

  actions: {
    async fetchTickets() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/tickets');
        this.tickets = data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async addTicket(ticket) {
      try {
        const { data } = await api.post('/tickets', ticket);

        this.tickets = [...this.tickets, data];

        return data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      }
    },

    async updateTicketStatus(id, status) {
      try {
        await api.patch(`/tickets/${id}/status`, { status });
        const storedTicket = this.tickets.find((ticket) => ticket.id === id);

        if (storedTicket) {
          storedTicket.status = status;
        } 
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      }
    },

    async sendTicket(id) {
      try {
        const { data } = await api.patch(`/tickets/${id}/send`);
        const storedTicket = this.tickets.find((ticket) => ticket.id === id);
        
        if (storedTicket) {
          const index = this.tickets.findIndex(ticket => ticket.id === id);

          if (index !== -1) {
            this.tickets[index] = { ...this.tickets[index], status: 'sent' };
          }
        } 

        return data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      }
    },
  },

  getters: {
    ticketDestribution: (state) => {
      let total = 0;
      const counts = {};
      const widths = {};

      state.statuses.forEach((statusName) => {
        counts[statusName] = state.tickets.filter((ticket) => {
          if (ticket.status === statusName) {
            total += 1;
            return true;
          }
        }).length;
      });

      for (const [key, value] of Object.entries(counts)) {
        widths[key] = value / total * 100;
      }
      
      return {
        total: total, 
        counts,
        widths,
      };
    },
    latestTickets: (state) => {
      const length = state.tickets.length;
      return state.tickets.slice(Math.max(length - 3, 0));
    },
    completedTickets: (state) => {
      return state.tickets.filter((ticket) => {
        return ticket.status === 'completed';
      });
    },
  },
});

