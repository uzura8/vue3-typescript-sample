import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
//import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'TopPage',
        component: () => import('@/views/TopPage.vue')
      },
      {
        path: '/home',
        name: 'HomePage',
        component: () => import('@/views/HomePage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/sign-in',
        name: 'SignInPage',
        component: () => import('@/views/SignInPage.vue')
      },
      {
        path: '/about',
        name: 'AboutPage',
        component: () => import('@/views/AboutPage.vue')
      },
      {
        path: '/posts',
        name: 'PostListPage',
        component: () => import('@/views/PostListPage.vue')
      },
      {
        path: '/posts/:slug',
        name: 'PostDetailPage',
        component: () => import('@/views/PostDetailPage.vue')
      },
      {
        path: '/items',
        name: 'ItemListPage',
        component: () => import('@/views/ItemListPage.vue')
      }
    ]
  },
  //{
  //  path: '/admin',
  //  component: AdminLayout,
  //  children: [],
  //},
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/views/NotFound.vue')
  }
]

export default routes
