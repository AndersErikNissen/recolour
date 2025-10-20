import { defineStore } from 'pinia';

export const useAlertsStore = defineStore('users', {
  state: () => ({ 
    activeUser: 'Operator',
  }),
  getters: {
    getUser: (state) => state.activeUser,
  },
  actions: {
    swapUser() {
      if (this.activeUser === 'Operator') {
        this.activeUser = 'Moderator';
      } else {
        this.activeUser = 'Operator';
      }
    },
  }
})