<script lang="ts">
import type { AxiosError } from 'axios'
import type { UserCredential } from 'firebase/auth'
import { FirebaseError } from '@firebase/util'
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { checkEmail, trimSpaces } from '@/utils/str'
import { convFirebaseErrorCodeToI18nKey } from '@/utils/site'
import { useGlobalLoaderStore } from '@/stores/globalLoader'
import { useMemberStore } from '@/stores/member'
import { FirebaseApi, MemberAccountApi } from '@/apis'
import FormInputField from '@/components/molecules/FormInputField.vue'
import FormInputPasswordField from '@/components/molecules/FormInputPasswordField.vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'

interface FieldErrors {
  email: string
  password: string
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
    const memberStore = useMemberStore()

    const errors = ref<FieldErrors>({ email: '', password: '' })
    const hasErrors = computed(() => {
      return Object.values(errors.value).some((error) => error)
    })
    const globalErrorMessage = ref<string>('')

    const email = ref<string>('')
    const validateEmail = () => {
      errors.value.email = ''
      globalErrorMessage.value = ''
      email.value = trimSpaces(email.value)
      if (!email.value) {
        errors.value.email = t('msg.inputRequired')
      } else if (!checkEmail(email.value)) {
        errors.value.email = t('msg.inputInvalid')
      }
    }

    const password = ref<string>('')
    const showPassword = ref<boolean>(false)
    const validatePassword = () => {
      errors.value.password = ''
      globalErrorMessage.value = ''
      if (!password.value) {
        errors.value.password = t('msg.inputRequired')
      } else if (password.value.length < 6) {
        errors.value.password = t('msg.atLeastCharacters', { count: 6 })
      }
    }

    const validateAll = () => {
      validateEmail()
      validatePassword()
    }

    const setMemberStore = async (userCredential: UserCredential) => {
      memberStore.setMember(userCredential.user)
      const idToken = await userCredential.user.getIdToken()
      memberStore.setIdToken(idToken)
      try {
        const user = await MemberAccountApi.getOne(idToken)
        if (user.username) {
          memberStore.setUsername(user.username)
        }
      } catch (error) {
        const apiError = error as AxiosError
        if (apiError.response?.status !== 404) {
          throw error
        }
      }
    }

    const handleError = (error: any) => {
      if (error instanceof FirebaseError) {
        const i18nKey = convFirebaseErrorCodeToI18nKey(error.code, 'signup')
        globalErrorMessage.value = t(i18nKey)
      } else {
        globalErrorMessage.value = t('msg.signUpFailed')
        console.error(error)
      }
    }

    const signUp = async () => {
      validateAll()
      if (hasErrors.value) return

      let userCredential: UserCredential | null = null
      try {
        globalLoader.updateLoading(true)
        userCredential = await FirebaseApi.signUp(email.value, password.value)
        await setMemberStore(userCredential)
        globalLoader.updateLoading(false)
        // router.push('/home')
      } catch (error: any) {
        handleError(error)
        globalLoader.updateLoading(false)
        return
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

    const signInWithGoogle = async () => {
      try {
        globalLoader.updateLoading(true)
        const userCredential = await FirebaseApi.signInWithOAuthGoogle()
        await setMemberStore(userCredential)
        globalLoader.updateLoading(false)
        router.push('/home')
      } catch (error) {
        handleError(error)
        globalLoader.updateLoading(false)
      }
    }

    return {
      errors,
      hasErrors,
      globalErrorMessage,
      email,
      validateEmail,
      password,
      showPassword,
      validatePassword,
      signUp,
      signInWithGoogle
    }
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center sm:pt-8 mx-auto">
    <div
      class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="px-6 pb-8 pt-4 sm:pt-12 space-y-4 sm:px-8">
        <BaseHeading
          class="mb-10"
          text-size="text-xl"
        >
          {{ $t('common.signUp') }}
        </BaseHeading>
        <div>
          <button
            type="button"
            class="inline-flex w-full text-gray-900 hover:bg-gray-100 bg-white border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center justify-center dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            @click="signInWithGoogle"
          >
            <svg
              class="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 186.69 190.5"
              xmlns:v="https://vecta.io/nano"
            >
              <g transform="translate(1184.583 765.171)">
                <path
                  clip-path="none"
                  mask="none"
                  d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
                  fill="#4285f4"
                />
                <path
                  clip-path="none"
                  mask="none"
                  d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                  fill="#34a853"
                />
                <path
                  clip-path="none"
                  mask="none"
                  d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
                  fill="#fbbc05"
                />
                <path
                  d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
                  fill="#ea4335"
                  clip-path="none"
                  mask="none"
                />
              </g>
            </svg>
            <span class="ml-2 font-medium">{{ $t('form.signUpWithGoogle') }}</span>
          </button>
        </div>
        <div class="relative inline-flex items-center justify-center w-full">
          <hr class="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <span
            class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"
            >or</span
          >
        </div>
        <form class="space-y-8">
          <FormInputField
            v-model="email"
            :label-text="$t('common.email')"
            @blur="validateEmail"
            :error-text="errors.email"
          />
          <FormInputPasswordField
            v-model="password"
            :label-text="$t('common.password')"
            @blur="validatePassword"
            :error-text="errors.password"
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
            @click="signUp"
            :disabled="hasErrors"
            type="button"
            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('common.signUp') }}
          </button>
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            {{ $t('form.doHaveAnAccountAlready') }}
            <RouterLink
              to="/signin"
              class="ml-2 text-base font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              {{ $t('common.signIn') }}
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
