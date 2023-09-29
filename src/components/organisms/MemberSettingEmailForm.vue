<script lang="ts">
import { FirebaseError } from '@firebase/util'
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updateEmail
} from 'firebase/auth'

import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useGlobalLoaderStore } from '@/stores/globalLoader'
import { useMemberStore } from '@/stores/member'
import { convFirebaseErrorCodeToI18nKey } from '@/utils/site'
import { FirebaseApi } from '@/apis'
import FormInputField from '@/components/molecules/FormInputField.vue'
import FormInputPasswordField from '../molecules/FormInputPasswordField.vue'

import { checkEmail } from '@/utils/str'

interface FieldErrors {
  email: string
  password: string
}

export default defineComponent({
  components: {
    FormInputField,
    FormInputPasswordField
  },

  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const globalLoader = useGlobalLoaderStore()
    const memberStore = useMemberStore()
    const { email } = storeToRefs(memberStore)

    const errors = ref<FieldErrors>({
      email: '',
      password: ''
    })

    const newEmail = ref<string>('')
    const validateEmail = () => {
      console.log('validateEmail', email.value, newEmail.value, newEmail.value === email.value)
      errors.value.email = ''
      if (!email.value) {
        errors.value.email = t('msg.inputRequired')
      } else if (checkEmail(newEmail.value) === false) {
        errors.value.email = t('msg.inputInvalid')
      } else if (newEmail.value === email.value) {
        errors.value.email = t('msg.sameEmailInput')
      }
    }

    const password = ref<string>('')
    const validatePassword = () => {
      errors.value.password = ''
      if (!password.value) {
        errors.value.password = t('msg.inputRequired')
      } else if (password.value.length < 6) {
        errors.value.password = t('msg.atLeastCharacters', { count: 6 })
      }
    }

    const globalErrorMessage = ref<string>('')
    const hasErrors = computed(() => {
      return Object.values(errors.value).some((error) => error)
    })

    const validateAll = () => {
      validateEmail()
      validatePassword()
    }

    const handleError = (error: any) => {
      if (error instanceof FirebaseError) {
        const i18nKey = convFirebaseErrorCodeToI18nKey(error.code, 'signup')
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
        user && (await updateEmail(user, newEmail.value))
        globalLoader.updateLoading(false)
      } catch (error) {
        handleError(error)
        globalLoader.updateLoading(false)
      }

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
      newEmail,
      password,
      errors,
      hasErrors,
      globalErrorMessage,
      validateEmail,
      validatePassword,
      update
    }
  }
})
</script>

<template>
  <form class="grid gap-8 mb-6">
    <FormInputField
      v-model="newEmail"
      input-type="email"
      :errorText="errors.email"
      :label-text="$t('common.email')"
      @blur="validateEmail"
    />
    <FormInputPasswordField
      v-model="password"
      :errorText="errors.password"
      :label-text="$t('form.currentPassword')"
      @blur="validatePassword"
    />

    <!--
    <p
      v-if="hasErrors"
      class="text-red-500 mt-6"
    >
      {{ $t('msg.errorsExist') }}
    </p>
    -->

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
