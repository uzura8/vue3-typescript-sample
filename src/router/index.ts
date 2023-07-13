import type { RouterScrollBehavior } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { FirebaseApi } from '@/apis'
import { useGlobalHeaderStore } from '@/stores/globalHeader'
import { useUserStore } from '@/stores/user'
import routes from './routes'

const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (to.hash) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          el: to.hash
          //behavior: 'smooth'
        })
      }, 500)
    })
  } else if (savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        //savedPosition.behavior = 'smooth'
        resolve(savedPosition)
      }, 500)
    })
  } else {
    return { left: 0, top: 0 }
  }
}

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior
})

router.beforeEach(async (to, _from, next) => {
  const globalHeader = useGlobalHeaderStore()
  globalHeader.updateMenuOpenStatus(false)

  const userStore = useUserStore()
  let user = FirebaseApi.getCurrentUser()
  if (!user) {
    user = await FirebaseApi.onAuthStateChanged()
  }
  userStore.setUser(user)
  if (user) {
    const idToken = await user.getIdToken()
    userStore.setIdToken(idToken)
  }

  const requiredAuth = to.matched.some((record) => record.meta.requiresAuth)
  const authForcedRedirectPaths = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password']

  if (user) {
    if (authForcedRedirectPaths.includes(to.path)) {
      next({ path: '/home' })
      return
    }
  } else {
    if (requiredAuth) {
      next({ path: '/sign-in' })
      return
    }
  }
  next()
})

export default router
