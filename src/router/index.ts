import type { RouterScrollBehavior } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useGlobalLoaderStore } from '@/stores/globalLoader.js'
import { useGlobalHeaderStore } from '@/stores/globalHeader'
import { useMemberStore } from '@/stores/member'
import { FirebaseApi } from '@/apis'
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
  const globalLoader = useGlobalLoaderStore()
  const globalHeader = useGlobalHeaderStore()
  globalHeader.updateMenuOpenStatus(false)
  globalHeader.updateMemberDropdownStatus(false)

  const memberStore = useMemberStore()
  let fuser = FirebaseApi.getCurrentUser()
  if (!fuser) {
    try {
      globalLoader.updateLoading(true)
      fuser = await FirebaseApi.onAuthStateChanged()
      memberStore.setMember(fuser)
      globalLoader.updateLoading(false)
    } catch (error) {
      console.error(error)
      globalLoader.updateLoading(false)
    }
  }
  if (fuser) {
    const idToken = await fuser.getIdToken()
    memberStore.setIdToken(idToken)
  }

  const requiredAuth = to.matched.some((record) => record.meta.requiresAuth)
  const authForcedRedirectPaths = ['/signin', '/signup', '/reset-password']

  if (fuser) {
    if (authForcedRedirectPaths.includes(to.path)) {
      next({ path: '/home' })
      return
    }
  } else {
    if (requiredAuth) {
      next({ path: '/signin' })
      return
    }
  }
  next()
})

export default router
