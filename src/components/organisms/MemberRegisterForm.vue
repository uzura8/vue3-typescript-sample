<script lang="ts">
import type { AxiosError } from 'axios'
import type { UserFormVals, User } from '@/types/User'
import { defineComponent, ref, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import { useGlobalLoaderStore } from '@/stores/globalLoader.js'
import { MemberAccountApi, FirebaseApi } from '@/apis'
import { checkUsername, trimSpaces } from '@/utils/str'
import FormInputField from '@/components/molecules/FormInputField.vue'

interface FieldErrors {
  username: string
  displayName: string
}

export default defineComponent({
  components: {
    FormInputField
  },

  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const globalLoader = useGlobalLoaderStore()

    const memberStore = useMemberStore()
    const { idToken, displayName } = storeToRefs(memberStore)

    const errors = ref<FieldErrors>({
      username: '',
      displayName: ''
    })
    const hasErrors = computed(() => {
      return Object.values(errors.value).some((error) => error)
    })

    const savedUser = ref<User | null>(null)

    const username = ref<string>('')
    const checkExistsUsername = async (): Promise<boolean | null> => {
      if (!username.value) return null
      try {
        await MemberAccountApi.checkExistsUsername(username.value, idToken.value)
        return true
      } catch (error) {
        const apiError = error as AxiosError
        if (apiError.response?.status === 404) {
          return false
        }
        console.log(apiError)
        return null
      }
    }
    const validateUsername = async () => {
      errors.value.username = ''
      username.value = trimSpaces(username.value)
      if (!username.value) {
        errors.value.username = t('msg.inputRequired')
      } else if (username.value.length < 2 || username.value.length > 15) {
        errors.value.username = t('msg.betweenCharLength', { min: 2, max: 15 })
      } else if (!checkUsername(username.value)) {
        errors.value.username = t('form.usernameFormatError')
      } else {
        const isExists = await checkExistsUsername()
        if (isExists === true) {
          errors.value.username = t('msg.alreadyInUse')
        }
      }
    }

    const displayNameInput = ref<string>('')
    const validateDisplayName = () => {
      displayNameInput.value = trimSpaces(displayNameInput.value)
      errors.value.displayName = ''
      if (!displayNameInput.value) {
        errors.value.displayName = t('msg.inputRequired')
      } else if (displayNameInput.value.length < 4 || displayNameInput.value.length > 50) {
        errors.value.displayName = t('msg.betweenCharLength', { min: 4, max: 50 })
      }
    }

    const resetAllInputs = () => {
      username.value = ''
      displayNameInput.value = ''
    }

    const validateAll = () => {
      validateUsername()
      validateDisplayName()
    }

    const isSaved = computed(() => {
      return savedUser.value != null
    })

    const saveAccount = async () => {
      validateAll()
      if (hasErrors.value) return

      try {
        globalLoader.updateLoading(true)
        let vals: UserFormVals = {
          displayName: displayNameInput.value
        }
        if (!isSaved.value) {
          vals['username'] = username.value
        }
        await MemberAccountApi.save(vals, idToken.value)
        const fuser = await FirebaseApi.onAuthStateChanged()
        if (fuser) {
          await fuser.reload()
          const idToken = await fuser.getIdToken()
          memberStore.setIdToken(idToken)
          const idTokenResult = await fuser.getIdTokenResult(true) // If add true, apply force reload
          memberStore.setIdTokenResult(idTokenResult)
          const member = FirebaseApi.getCurrentUser()
          memberStore.setMember(member)
        }
        memberStore.setUsername(username.value)

        globalLoader.updateLoading(false)
        resetAllInputs()
        router.push('/home')
      } catch (error) {
        console.error(error)
        globalLoader.updateLoading(false)
      }
    }

    const setSavedUser = async (): Promise<void> => {
      globalLoader.updateLoading(true)
      try {
        savedUser.value = await MemberAccountApi.getOne(idToken.value)
        globalLoader.updateLoading(false)
      } catch (error) {
        const apiError = error as AxiosError
        if (apiError.response?.status !== 404) {
          console.log(apiError)
        }
        globalLoader.updateLoading(false)
      }
    }

    const setDisplayNameInput = () => {
      if (savedUser.value && savedUser.value.displayName) {
        displayNameInput.value = savedUser.value.displayName
      } else if (displayName.value) {
        displayNameInput.value = displayName.value
      } else if (savedUser.value && savedUser.value.username) {
        displayNameInput.value = savedUser.value.username
      }
    }

    const setUsername = () => {
      if (isSaved.value) {
        username.value = savedUser.value?.username || ''
        return
      }
      if (!checkUsername(displayNameInput.value)) return
      username.value = displayNameInput.value
    }
    onBeforeMount(async () => {
      await setSavedUser()
      setDisplayNameInput()
      setUsername()
    })

    return {
      isSaved,
      errors,
      hasErrors,
      username,
      displayNameInput,
      validateUsername,
      validateDisplayName,
      saveAccount
    }
  }
})
</script>

<template>
  <form class="w-full">
    <div class="grid gap-8">
      <div v-if="isSaved && !!username">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          <span>{{ $t('common.username') }}</span>
        </label>
        <span class="text-lg">{{ username }}</span>
        <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <div>{{ $t('form.usedForUsername') }}</div>
          <div class="mt-2">{{ $t('form.attentionForUsername') }}</div>
        </div>
      </div>
      <div v-else>
        <FormInputField
          v-model="username"
          :errorText="errors.username"
          :label-text="$t('common.username')"
          :helper-texts="[
            $t('form.allowedCharsForUsername'),
            $t('form.usedForUsername'),
            $t('form.attentionForUsername')
          ]"
          @blur="validateUsername"
        />
      </div>

      <FormInputField
        v-model="displayNameInput"
        :errorText="errors.displayName"
        :label-text="$t('common.displayName')"
        :helper-text="$t('form.usedForDisplayName')"
        @blur="validateDisplayName"
      />

      <div>
        <p
          v-if="hasErrors"
          class="text-red-600 dark:text-red-500"
        >
          {{ $t('msg.errorsExist') }}
        </p>

        <button
          @click="saveAccount"
          type="button"
          :disabled="hasErrors"
          class="mt-4 w-full px-3 py-2 font-medium text-center focus:ring-4 focus:outline-none rounded-lg focus:ring-blue-300"
          :class="{
            'text-white bg-primary-400 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 cursor-not-allowed':
              !isSaved && hasErrors,
            'text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800':
              !isSaved && !hasErrors,
            'text-primary-700 hover:text-white border border-primary-500 hover:bg-primary-400 dark:hover:bg-primary-500 dark:focus:ring-primary-600 cursor-not-allowed':
              isSaved && hasErrors,
            'text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-800 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-500 dark:focus:ring-primary-800':
              isSaved && !hasErrors
          }"
          v-text="isSaved ? $t('common.update') : $t('common.register')"
        ></button>
      </div>
    </div>
  </form>
</template>
