<script lang="ts">
import { FirebaseError } from '@firebase/util'
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { checkEmail, trimSpaces } from '@/utils/str'
import { convFirebaseErrorCodeToI18nKey } from '@/utils/site'
import { useGlobalLoaderStore } from '@/stores/globalLoader'
import { FirebaseApi } from '@/apis'
import FormInputField from '@/components/molecules/FormInputField.vue'
import FormInputPasswordField from '@/components/molecules/FormInputPasswordField.vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'

interface FieldErrors {
  email: string
}

export default defineComponent({
  components: {
    FormInputField,
    FormInputPasswordField,
    BaseHeading
  },

  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const globalLoader = useGlobalLoaderStore()

    const errors = ref<FieldErrors>({ email: '' })
    const hasErrors = computed(() => {
      return Object.values(errors.value).some((error) => error)
    })
    const globalErrorMessage = ref<string>('')

    const email = ref<string>('')
    const validateEmail = () => {
      errors.value.email = ''
      email.value = trimSpaces(email.value)
      if (!email.value) {
        errors.value.email = t('msg.inputRequired')
      } else if (!checkEmail(email.value)) {
        errors.value.email = t('msg.inputInvalid')
      }
    }

    const validateAll = () => {
      validateEmail()
    }

    const handleError = (error: any) => {
      if (error instanceof FirebaseError) {
        const i18nKey = convFirebaseErrorCodeToI18nKey(error.code)
        globalErrorMessage.value = t(i18nKey)
      } else {
        globalErrorMessage.value = t('msg.sendFailed')
        console.error(error)
      }
    }

    const sendPasswordResetEmail = async () => {
      validateAll()
      if (hasErrors.value) return

      try {
        globalLoader.updateLoading(true)
        await FirebaseApi.sendPasswordResetEmail(email.value)
        globalLoader.updateLoading(false)
        router.push({
          path: '/member/register/sent-account-mail',
          query: { mode: 'resetPassword' }
        })
      } catch (error) {
        handleError(error)
        globalLoader.updateLoading(false)
        return
      }
    }

    return {
      errors,
      hasErrors,
      globalErrorMessage,
      email,
      validateEmail,
      sendPasswordResetEmail
    }
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center sm:py-8 mx-auto">
    <div
      class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="px-6 pb-16 pt-4 sm:pt-16 space-y-4 sm:px-8">
        <BaseHeading
          class="mb-10"
          text-size="text-xl"
        >
          {{ $t('page.passwordReset') }}
        </BaseHeading>
        <p class="pb-4 text-sm text-gray-600">{{ $t('msg.enterEmailToResetPassword') }}</p>
        <form class="block space-y-8">
          <FormInputField
            v-model="email"
            input-type="email"
            :label-text="$t('common.email')"
            @blur="validateEmail"
            :error-text="errors.email"
          />

          <p
            v-if="hasErrors"
            class="text-sm text-red-600 dark:text-red-500"
          >
            {{ $t('msg.errorsExist') }}
          </p>
          <p
            v-else-if="globalErrorMessage"
            class="text-sm text-red-600 dark:text-red-500"
          >
            {{ globalErrorMessage }}
          </p>
          <button
            @click="sendPasswordResetEmail"
            :disabled="hasErrors"
            type="button"
            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('common.doSend') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
