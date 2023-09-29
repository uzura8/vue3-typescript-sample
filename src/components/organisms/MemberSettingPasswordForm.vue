<script lang="ts">
import { FirebaseError } from '@firebase/util'
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth'

import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalLoaderStore } from '@/stores/globalLoader'
import { convFirebaseErrorCodeToI18nKey } from '@/utils/site'
import FormInputPasswordField from '../molecules/FormInputPasswordField.vue'

interface FieldErrors {
  password: string
  newPassword: string
}

export default defineComponent({
  components: {
    FormInputPasswordField
  },

  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const globalLoader = useGlobalLoaderStore()

    const errors = ref<FieldErrors>({
      password: '',
      newPassword: ''
    })

    const password = ref<string>('')
    const validatePassword = () => {
      errors.value.password = ''
      if (!password.value) {
        errors.value.password = t('msg.inputRequired')
      } else if (password.value.length < 6) {
        errors.value.password = t('msg.atLeastCharacters', { count: 6 })
      }
    }

    const newPassword = ref<string>('')
    const validateNewPassword = () => {
      errors.value.newPassword = ''
      if (!password.value) {
        errors.value.newPassword = t('msg.inputRequired')
      }
    }

    const globalErrorMessage = ref<string>('')
    const hasErrors = computed(() => {
      return Object.values(errors.value).some((error) => error)
    })

    const validateAll = () => {
      validatePassword()
      validateNewPassword()
    }

    const handleError = (error: any) => {
      if (error instanceof FirebaseError) {
        const i18nKey = convFirebaseErrorCodeToI18nKey(error.code)
        globalErrorMessage.value = t(i18nKey)
      } else {
        globalErrorMessage.value = t('msg.editFailed')
        console.error(error)
      }
    }

    const update = async () => {
      validateAll()
      if (hasErrors.value) return

      const user = getAuth().currentUser
      try {
        globalLoader.updateLoading(true)
        const credential = EmailAuthProvider.credential(user?.email ?? '', password.value)
        user && (await reauthenticateWithCredential(user, credential))
        user && (await updatePassword(user, newPassword.value))
        globalLoader.updateLoading(false)
        router.push('/member/settings')
      } catch (error) {
        handleError(error)
        globalLoader.updateLoading(false)
      }
    }

    return {
      password,
      newPassword,
      errors,
      hasErrors,
      globalErrorMessage,
      validatePassword,
      validateNewPassword,
      update
    }
  }
})
</script>

<template>
  <form class="grid gap-8 mb-6">
    <FormInputPasswordField
      v-model="password"
      :errorText="errors.password"
      :label-text="$t('form.currentPassword')"
      @blur="validatePassword"
    />
    <FormInputPasswordField
      v-model="newPassword"
      :errorText="errors.newPassword"
      :label-text="$t('form.newPassword')"
      @blur="validateNewPassword"
    />

    <p
      v-if="globalErrorMessage"
      class="text-sm text-red-600 dark:text-red-500"
    >
      {{ globalErrorMessage }}
    </p>
    <div class="text-center">
      <button
        @click="update"
        type="button"
        :disabled="hasErrors"
        class="w-full max-w-md text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t('common.doChange') }}
      </button>
    </div>
  </form>
</template>
