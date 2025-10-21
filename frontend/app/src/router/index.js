import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/Dashboard.vue'
import TicketsQueueView from '../views/tickets/Queue.vue'
import ApprovedPhotosView from '../views/ApprovedPhotos.vue'
import PartnersView from '../views/Partners.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/tickets/queue',
    name: 'Tickets - Queue',
    component: TicketsQueueView,
  },
  {
    path: '/approved-photos',
    name: 'Approved photos',
    component: ApprovedPhotosView,
  },
  {
    path: '/partners',
    name: 'Partners',
    component: PartnersView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router