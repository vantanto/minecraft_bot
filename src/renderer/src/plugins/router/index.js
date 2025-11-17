import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    component: () => import('@renderer/views/layouts/AppMain.vue'),
    path: '',
    redirect: { name: 'index' },
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@renderer/views/ServerSelectorView.vue'),
      },
      {
        path: '/usernames',
        name: 'usernames',
        component: () => import('@renderer/views/UsernameListView.vue'),
      },
    ],
  },
  {
    component: () => import('@renderer/views/layouts/AppMainNoFooter.vue'),
    children: [
      {
        path: '/chat/:username',
        name: 'chat',
        props: true,
        component: () => import('@renderer/views/ChatBotView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
  routes,
})

export default router
