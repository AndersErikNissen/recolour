import { defineStore } from 'pinia';

export const useAlertsStore = defineStore('users', {
  state: () => ({ 
    activeUser: 'Operator',
    availableUsers: ['Operator', 'Manager'],
  }),
  actions: {
    swapTo(newUser) {
      this.activeUser = this.availableUsers.find((userName) => userName === newUser) || 'Operator';
    },
  }
})