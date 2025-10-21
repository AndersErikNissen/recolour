import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/Dashboard.vue'
import TicketsQueueView from '../views/tickets/Queue.vue'
import TicketsCreateView from '../views/tickets/Create.vue'
import ApprovedPhotosView from '../views/ApprovedPhotos.vue'
import PartnersView from '../views/Partners.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
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
  {
    path: '/tickets/create',
    name: 'Tickets - Create',
    component: TicketsCreateView,
  },
  {
    path: '/tickets/queue',
    name: 'Tickets - Queue',
    component: TicketsQueueView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router