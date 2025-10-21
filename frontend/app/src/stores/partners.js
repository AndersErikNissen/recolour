import { defineStore } from 'pinia';
import { api } from '@/api.js';

export const usePartnerStore = defineStore('partners', {
  state: () => ({
    partners: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchPartners() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/partners');
        this.partners = data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});