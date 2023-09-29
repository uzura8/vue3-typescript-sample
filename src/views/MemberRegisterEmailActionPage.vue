<script lang="ts">
import type { AxiosError } from 'axios'
import type { UserCredential } from 'firebase/auth'
import { defineComponent, ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalLoaderStore } from '@/stores/globalLoader'
import { useMemberStore } from '@/stores/member'
import { FirebaseApi, MemberAccountApi } from '@/apis'
import { FirebaseError } from '@firebase/util'
import { convFirebaseErrorCodeToI18nKey } from '@/utils/site'
import BaseHeading from '@/components/atoms/BaseHeading.vue'
import FormInputPasswordField from '@/components/molecules/FormInputPasswordField.vue'
import type { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default defineComponent({
  components: {
    BaseHeading,
    FormInputPasswordField
  },

  setup() {
    const router = useRouter()
    const globalLoader = useGlobalLoaderStore()
    const memberStore = useMemberStore()
    const route = useRoute()
    const { t } = useI18n()

    const mainTitle = ref<string>(t('page.emailVerification'))
    const subTitle = ref<string>('')
    const resBody = ref<string>('')
    const resType = ref<string>('')
    const globalErrorMessage = ref<string>('')

    const { customClaims, username, isAuth } = storeToRefs(memberStore)
    const isRegistered = computed(() => {
      return customClaims.value?.isRegistered && username.value
    })

    const email = ref<string>('')

    const mode = computed(() => {
      if (!route.query.mode || typeof route.query.mode !== 'string') return ''
      return route.query.mode
    })
    const actionCode = computed(() => {
      if (!route.query.oobCode || typeof route.query.oobCode !== 'string') return ''
      return route.query.oobCode
    })

    // const continueUrl = computed(() => {
    //   if (!route.query.continueUrl || typeof route.query.continueUrl !== 'string') return ''
    //   return route.query.continueUrl
    // })
    // const lang = computed(() => route.query.lang || 'en')

    // const hasErrors = computed(() => {
    //   let hasError = false
    //   Object.keys(errors.value).map((field) => {
    //     if (errors.value[field].length > 0) hasError = true
    //   })
    //   return hasError
    // })

    const handleVerifyEmail = async (actionCode: string) => {
      try {
        globalLoader.updateLoading(true)
        await FirebaseApi.applyActionCode(actionCode)
        const member = FirebaseApi.getCurrentUser()
        if (member) {
          await member.reload()
        }
        memberStore.setMember(member)
        resBody.value = t('msg.verifyEmailCompleted')
        resType.value = 'success'
        globalLoader.updateLoading(false)
      } catch (error) {
        globalErrorMessage.value = t('msg.errorOccurred')
        console.error(error)
        globalLoader.updateLoading(false)
      }
    }

    const isActivePasswordReset = ref<boolean>(false)
    // const handleResetPassword = async (actionCode, continueUrl, lang) => {
    const handleResetPassword = async (actionCode: string) => {
      globalLoader.updateLoading(true)
      try {
        email.value = await FirebaseApi.verifyPasswordResetCode(actionCode)
        isActivePasswordReset.value = true
        globalLoader.updateLoading(false)
      } catch (error) {
        globalErrorMessage.value = t('msg.errorOccurred')
        console.error(error)
        globalLoader.updateLoading(false)
      }
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

    const handleRecoverEmail = async (actionCode: string) => {
      try {
        globalLoader.updateLoading(true)
        const info = await FirebaseApi.checkActionCode(actionCode)
        const restoredEmail = info['data']['email']
        await FirebaseApi.applyActionCode(actionCode)
        if (!restoredEmail) {
          throw new Error('No restored email')
        }
        await FirebaseApi.sendPasswordResetEmail(restoredEmail)
        globalLoader.updateLoading(false)
        router.push({
          path: '/member/register/sent-account-mail',
          query: { mode: 'resetPassword' }
        })
      } catch (error) {
        handleError(error)
        globalLoader.updateLoading(false)
      }
    }

    const handleEmailAction = (
      mode: string,
      actionCode: string
      // continueUrl: string,
      // lang: string
    ) => {
      switch (mode) {
        case 'resetPassword':
          // handleResetPassword(actionCode, continueUrl, lang)
          handleResetPassword(actionCode)
          break
        case 'recoverEmail':
          handleRecoverEmail(actionCode)
          break
        case 'verifyEmail':
          handleVerifyEmail(actionCode)
          break
        default:
      }
    }

    const password = ref<string>('')
    const passwordError = ref<string>('')
    const showPassword = ref<boolean>(false)
    const validatePassword = () => {
      passwordError.value = ''
      if (!password.value) {
        passwordError.value = t('msg.inputRequired')
      } else if (password.value.length < 6) {
        passwordError.value = t('msg.atLeastCharacters', { count: 6 })
      }
    }

    const setMemberStore = async (userCredential: UserCredential) => {
      memberStore.setMember(userCredential.user)
      const idToken = await userCredential.user.getIdToken()
      memberStore.setIdToken(idToken)
      const idTokenResult = await userCredential.user.getIdTokenResult()
      memberStore.setIdTokenResult(idTokenResult)
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

    const confirmPasswordReset = async () => {
      try {
        globalLoader.updateLoading(true)
        await FirebaseApi.confirmPasswordReset(actionCode.value, password.value)
        const userCredential = await FirebaseApi.signIn(email.value, password.value)
        await setMemberStore(userCredential)
        resBody.value = t('msg.changedOf', { label: t('common.password') })
        resType.value = 'success'
        isActivePasswordReset.value = false
        globalLoader.updateLoading(false)
      } catch (error) {
        if (error instanceof FirebaseError) {
          const i18nKey = convFirebaseErrorCodeToI18nKey(error.code, 'signup')
          globalErrorMessage.value = t(i18nKey)
        } else {
          globalErrorMessage.value = t('msg.signInFailed')
          console.error(error)
        }
        globalLoader.updateLoading(false)
      }
    }

    onBeforeMount(() => {
      // handleEmailAction(mode.value, actionCode.value, continueUrl.value, lang.value)
      handleEmailAction(mode.value, actionCode.value)
    })

    return {
      mode,
      isAuth,
      isActivePasswordReset,
      password,
      passwordError,
      showPassword,
      validatePassword,
      isRegistered,
      globalErrorMessage,
      mainTitle,
      subTitle,
      resBody,
      resType,
      confirmPasswordReset
    }
  }
})
</script>

<template>
  <div class="main-container">
    <div class="w-full max-w-2xl flex flex-col">
      <div v-if="mode === 'resetPassword' && isActivePasswordReset">
        <BaseHeading>{{ $t('page.chooseNewPassword') }}</BaseHeading>
        <p class="mt-12 text-sm text-gray-600">{{ $t('msg.registerPasswordAttention') }}</p>
        <form class="space-y-12 mt-12">
          <FormInputPasswordField
            v-model="password"
            :label-text="$t('form.newPassword')"
            @blur="validatePassword"
            :error-text="passwordError"
          />
          <p
            v-if="globalErrorMessage"
            class="text-sm text-danger-600 dark:text-danger-500"
          >
            {{ globalErrorMessage }}
          </p>
          <div class="text-center">
            <button
              @click="confirmPasswordReset"
              :disabled="!!passwordError"
              type="button"
              class="w-full max-w-md text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('msg.changePassword') }}
            </button>
          </div>
        </form>
      </div>

      <div v-else>
        <BaseHeading>{{ mainTitle }}</BaseHeading>
        <h3
          v-if="subTitle"
          class="is-size-5"
        >
          {{ subTitle }}
        </h3>
        <div
          v-if="globalErrorMessage"
          class="p-8 mt-12 mr-2 text-lg text-danger-800 rounded-lg bg-danger-50 dark:bg-gray-800 dark:text-danger-400"
          role="alert"
        >
          <FontAwesomeIcon icon="circle-exclamation" />
          {{ globalErrorMessage }}
        </div>
        <div
          v-else-if="resBody"
          class="p-8 mt-12 text-lg"
          :class="{
            'text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400':
              resType === 'success'
          }"
          role="success"
        >
          {{ resBody }}
        </div>
        <div class="text-center pt-16">
          <router-link
            v-if="isRegistered"
            to="/home"
            class="inline-block w-full max-w-sm text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-3 text-base font-medium text-center mr-2 mb-2 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-500 dark:focus:ring-primary-800"
          >
            <FontAwesomeIcon icon="home" />
            <span class="ml-2">
              {{ $t('common.linkTo', { label: $t('page.home') }) }}
            </span>
          </router-link>
          <router-link
            v-else-if="isAuth"
            to="/member/register/account"
            class="inline-block w-full max-w-sm text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-3 text-base font-medium text-center mr-2 mb-2 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-500 dark:focus:ring-primary-800"
          >
            <FontAwesomeIcon icon="right-long" />
            <span class="ml-2">
              {{ $t('common.registerOf', { label: $t('common.accountInfo') }) }}
            </span>
          </router-link>
          <router-link
            v-else
            to="/"
            class="inline-block w-full max-w-sm text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg px-5 py-3 text-base font-medium text-center mr-2 mb-2 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-500 dark:focus:ring-primary-800"
          >
            <FontAwesomeIcon icon="right-long" />
            <span class="ml-2">
              {{ $t('page.top') }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
