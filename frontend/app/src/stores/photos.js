import { defineStore } from 'pinia';
import { api } from '@/api.js';

export const usePhotoStore = defineStore('photos', {
  state: () => ({
    photos: {
      available: {
        attachments: [],
        recolours: [],
        tickets: [],
      },
    },
    counts: {
      available: 0,
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAvailablePhotos() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get('/available-photos');
        this.photos.available = data;
        
        let count = 0;
        for (const [key, value] in data) {
          count += value.length;
        };

        this.counts.available = count;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});