import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'vocabulary',
      component: () => import('../views/VocabularyView.vue'),
    },
    { path: '/admin/words', name: 'admin-words', component: () => import('../views/AdminWordsView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
