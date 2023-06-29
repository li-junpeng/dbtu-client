import { createRouter, createWebHistory } from 'vue-router'
import IconConnection from '@/icons/svg/connection.vue'
import IconTeam from '@/icons/svg/team.vue'
import IconLog from '@/icons/svg/log.vue'
import IconRecycled from '@/icons/svg/recycled.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/manage/connection'
    },
    {
      path: '/manage',
      name: 'Manage',
      component: () => import('@/views/manage/index.vue'),
      children: [
        {
          path: '/manage/connection',
          name: 'ConnectionManage',
          meta: {
            title: '连接管理',
            icon: IconConnection
          },
          component: () => import('@/views/manage/connection/index.vue')
        },
        {
          path: '/manage/team',
          name: 'TeamManage',
          meta: {
            title: '团队管理',
            icon: IconTeam
          },
          component: () => import('@/views/manage/team/index.vue')
        },
        {
          path:'/manage/log',
          name: 'LogManage',
          meta: {
            title: '操作日志',
            icon: IconLog
          },
          component: () => import('@/views/manage/log/index.vue')
        },
        {
          path: '/manage/recycled',
          name: 'Recycled',
          meta: {
            title: '回收站',
            icon: IconRecycled
          },
          component: () => import('@/views/manage/recycled/index.vue')
        }
      ]
    }
  ]
})

export default router
