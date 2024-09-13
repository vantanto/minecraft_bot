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
        component: () => import('@renderer/views/IndexView.vue')
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
