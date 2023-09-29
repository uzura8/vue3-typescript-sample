import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import MemberRegisterLayout from '@/layouts/MemberRegisterLayout.vue'
//import AdminLayout from '@/layouts/AdminLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/member/register',
    component: MemberRegisterLayout,
    children: [
      {
        path: '/member/register/account',
        name: 'MemberRegisterAccount',
        component: () => import('@/views/MemberRegisterAccountPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/member/register/email-action',
        name: 'MemberRegisterEmailAction',
        component: () => import('@/views/MemberRegisterEmailActionPage.vue')
      },
      {
        path: '/member/register/sent-account-mail',
        name: 'SentAccountMailPage',
        component: () => import('@/views/SentAccountMailPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'TopPage',
        component: () => import('@/views/TopPage.vue')
      },
      // {
      //   path: '/home',
      //   name: 'HomePage',
      //   component: () => import('@/views/HomePage.vue'),
      //   meta: {
      //     requiresAuth: true
      //   }
      // },
      {
        path: '/signin',
        name: 'SignInPage',
        component: () => import('@/views/SignInPage.vue')
      },
      {
        path: '/signup',
        name: 'SignUpPage',
        component: () => import('@/views/SignUpPage.vue')
      },
      {
        path: '/reset-password',
        name: 'ResetPasswordPage',
        component: () => import('@/views/ResetPasswordPage.vue')
      },
      {
        path: '/about',
        name: 'AboutPage',
        component: () => import('@/views/AboutPage.vue')
      },
      {
        path: '/member/profile',
        name: 'MemberProfile',
        component: () => import('@/views/MemberProfilePage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/member/settings',
        name: 'MemberSettings',
        component: () => import('@/views/MemberSettingsPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/member/settings/email',
        name: 'MemberSettingsEmail',
        component: () => import('@/views/MemberSettingsEmailPage.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/member/settings/password',
        name: 'MemberSettingsPassword',
        component: () => import('@/views/MemberSettingsPasswordPage.vue'),
        meta: {
          requiresAuth: true
        }
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
        path: '/about',
        name: 'AboutPage',
        component: () => import('@/views/AboutPage.vue')
      },
      {
        path: '/:catchAll(.*)*',
        component: () => import('@/views/NotFound.vue')
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
