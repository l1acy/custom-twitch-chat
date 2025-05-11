import { createRouter, createWebHistory } from 'vue-router'

import ChatView from './views/ChatView.vue'
import HomeView from './views/HomeView.vue'
import NotFoundView from './views/NotFoundView.vue'
import CssClear from './views/CssClear.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/chat/:channel', component: ChatView },
  { path: '/css/clear', component: CssClear },
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router