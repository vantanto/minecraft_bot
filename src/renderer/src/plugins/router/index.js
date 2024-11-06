import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  {
    component: () => import('@renderer/views/layouts/AppMain.vue'),
    path: '',
    redirect: { name: 'index' },
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@renderer/views/ServerSelectorView.vue')
      },
      {
        path: '/usernames',
        name: 'usernames',
        component: () => import('@renderer/views/UsernameListView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
  routes
})

export default router
