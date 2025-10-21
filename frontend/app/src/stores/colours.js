import { defineStore } from 'pinia';

export const useColourStore = defineStore('colours', {
  state: () => ({
    colors: {
      status: {
        text: {
          pending: 'text-status-pending',
          sent: 'text-status-sent',
          'in progress': 'text-status-inprogress',
          completed: 'text-status-completed',
          rejected: 'text-status-rejected',
        },
      },
      priority: {
        text: {
          low: 'text-priority-low',
          medium: 'text-priority-medium',
          high: 'text-priority-high',
        }
      }
    }
  }),

  getters: {
    statusColours: (state) => state.colors.status,
    priorityColours: (state) => state.colors.priority,
  },
});
