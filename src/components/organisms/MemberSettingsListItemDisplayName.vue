<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { AxiosError } from 'axios'
import { useI18n } from 'vue-i18n'
import { useMemberStore } from '@/stores/member'
import { useGlobalLoaderStore } from '@/stores/globalLoader.js'
import { MemberProfileApi, FirebaseApi } from '@/apis'

export default defineComponent({
  components: {},

  setup() {
    const { t } = useI18n()
    const globalLoader = useGlobalLoaderStore()

    const memberStore = useMemberStore()
    const { member, setMember, idToken } = memberStore

    const isEditActive = ref<boolean>(false)
    const displayName = ref<string>(member?.displayName || '')
    let displayNameBeforeEdit = member?.displayName || ''

    const errorMessage = ref<string>('')
    const validate = () => {
      errorMessage.value = ''
      if (!displayName.value) {
        errorMessage.value = t('msg.inputRequired')
      } else if (displayName.value.length < 4 || displayName.value.length > 50) {
        errorMessage.value = t('msg.betweenCharLength', { min: 4, max: 50 })
      }
    }
    const hasError = computed(() => {
      return !!errorMessage.value
    })

    const cancel = () => {
      displayName.value = displayNameBeforeEdit
      errorMessage.value = ''
      isEditActive.value = false
    }

    const save = async () => {
      if (displayName.value === displayNameBeforeEdit) {
        cancel()
        return
      }
      validate()
      if (errorMessage.value) return

      try {
        globalLoader.updateLoading(true)
        const vals = {
          displayName: displayName.value
        }
        await MemberProfileApi.save(vals, idToken)
        const member = await FirebaseApi.updateProfile(vals)
        setMember(member)
        displayNameBeforeEdit = displayName.value
        isEditActive.value = false
        globalLoader.updateLoading(false)
      } catch (error) {
        const apiError = error as AxiosError
        if (apiError.response?.status === 400) {
          errorMessage.value = t('msg.inputInvalid')
        } else if (apiError.response?.status === 500) {
          errorMessage.value = t('msg.serverError')
        } else {
          errorMessage.value = t('msg.errorOccurred')
          console.error(error)
        }
        globalLoader.updateLoading(false)
      }
    }

    return {
      displayName,
      isEditActive,
      errorMessage,
      hasError,
      validate,
      cancel,
      save
    }
  }
})
</script>

<template>
  <div class="flex flex-col py-4">
    <dt class="mb-1 text-gray-500 dark:text-gray-400">
      {{ $t('common.displayName') }}
    </dt>
    <dd>
      <div v-if="isEditActive">
        <div>
          <input
            v-model="displayName"
            @blur="validate"
            type="text"
            class="w-full bg-gray-50 border text-gray-900 text-lg rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :class="{
              'bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500':
                hasError
            }"
          />
          <p
            v-if="errorMessage"
            class="mt-2 text-sm text-red-600 dark:text-red-500"
          >
            {{ errorMessage }}
          </p>
        </div>
        <div class="pt-2">
          <button
            class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            @click="cancel"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            class="ml-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-3 py-2 text-sm dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            :class="{ 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed': hasError }"
            @click="save"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
      <div
        v-else
        class="text-lg font-medium flex justify-between items-center"
      >
        <span class="truncate w-full">{{ displayName }}</span>
        <button
          class="text-sm text-primary-600 dark:text-primary-500 hover:underline whitespace-nowrap"
          @click="isEditActive = true"
        >
          {{ $t('common.change') }}
        </button>
      </div>
    </dd>
  </div>
</template>
