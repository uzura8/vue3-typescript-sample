<script lang="ts">
import { FirebaseError } from '@firebase/util'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalLoaderStore } from '@/stores/globalLoader.js'
import { FirebaseApi } from '@/apis'
import { convFirebaseErrorCodeToI18nKey } from '@/utils/site'

export default defineComponent({
  components: {},

  setup() {
    const globalLoader = useGlobalLoaderStore()

    const router = useRouter()
    const { t } = useI18n()
    const globalErrorMessage = ref<string>('')
    const handleError = (error: any) => {
      if (error instanceof FirebaseError) {
        const i18nKey = convFirebaseErrorCodeToI18nKey(error.code, 'signup')
        globalErrorMessage.value = t(i18nKey)
      } else {
        globalErrorMessage.value = t('msg.signUpFailed')
        console.error(error)
      }
    }

    const sendEmailVerification = async () => {
      try {
        globalLoader.updateLoading(true)
        await FirebaseApi.sendEmailVerification()
        globalLoader.updateLoading(false)
        router.push({ path: '/member/register/sent-account-mail', query: { mode: 'verifyEmail' } })
      } catch (error: any) {
        handleError(error)
        globalLoader.updateLoading(false)
      }
    }

    return {
      sendEmailVerification
    }
  }
})
</script>

<template>
  <button
    type="button"
    class="font-medium text-primary-600 dark:text-primary-500 hover:underline"
    @click="sendEmailVerification"
  >
    {{ $t('common.doResend') }}
  </button>
</template>
