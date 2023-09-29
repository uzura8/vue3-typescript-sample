import type { User as FirebaseUser, IdTokenResult } from '@firebase/auth'
import type { CustomClaims } from '@/types/Member'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMemberStore = defineStore(
  'member',
  () => {
    const member = ref<FirebaseUser | null>(null)
    const username = ref<string | null>(null)
    const idToken = ref<string | null>(null)
    const idTokenResult = ref<IdTokenResult | null>(null)

    const reset = (): void => {
      member.value = null
      username.value = null
      idToken.value = null
      idTokenResult.value = null
    }

    const isAuth = computed((): boolean => {
      return member.value !== null
    })

    const displayName = computed((): string => {
      if (member.value === null) {
        return ''
      }
      return member.value.displayName || ''
    })

    const photoURL = computed((): string => {
      if (member.value === null) {
        return ''
      }
      return member.value.photoURL || ''
    })

    const email = computed((): string => {
      if (member.value === null) {
        return ''
      }
      return member.value.email || ''
    })

    const uid = computed((): string => {
      if (member.value === null) {
        return ''
      }
      return member.value.uid
    })

    const emailVerified = computed((): boolean => {
      if (member.value === null) {
        return false
      }
      return member.value.emailVerified || false
    })

    const setMember = (authedUser: FirebaseUser | null): void => {
      if (authedUser) {
        member.value = {
          ...authedUser,
          displayName: authedUser.displayName,
          email: authedUser.email
          // If you want to add more properties, you can add here.
        }
      } else {
        reset()
      }
    }

    const setIdToken = (token: string | null): void => {
      idToken.value = token
    }

    const setIdTokenResult = (tokenRes: IdTokenResult | null): void => {
      idTokenResult.value = tokenRes ? tokenRes : null
    }

    const setUsername = (name: string | null): void => {
      username.value = name
    }

    function hasClaims(obj: any): obj is { claims: { [x: string]: any } } {
      return 'claims' in obj
    }

    const customClaims = computed((): CustomClaims | null => {
      if (member.value === null) {
        return null
      }
      if (idTokenResult.value === null) {
        return null
      }
      if (hasClaims(idTokenResult.value)) {
        return idTokenResult.value.claims
      }
      return null
    })

    return {
      member,
      username,
      uid,
      emailVerified,
      idToken,
      customClaims,
      isAuth,
      displayName,
      photoURL,
      email,
      setMember,
      setIdToken,
      setIdTokenResult,
      setUsername,
      reset
    }
  }
  // { persist: true }
)
