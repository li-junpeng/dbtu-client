import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/manage/index.vue'),
      children: [
        {
          path: '/connection',
          name: 'ConnectionManage',
          component: () => import('@/views/manage/connection/index.vue')
        },
        {
          path: '/team',
          name: 'TeamManage',
          component: () => import('@/views/manage/team/index.vue')
        }
      ]
    }
  ]
})

export default router
