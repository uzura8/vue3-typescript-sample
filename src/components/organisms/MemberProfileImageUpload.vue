<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import { useGlobalLoaderStore } from '@/stores/globalLoader'
import { useToast } from '@/composables/useToast'
import { MemberProfileApi } from '@/apis'
import { getUploadConfigs } from '@/utils/site'
import { bytesFormat } from '@/utils/str'
import BaseHeading from '@/components/atoms/BaseHeading.vue'
import BaseDialog from '@/components/molecules/BaseDialog.vue'

export default defineComponent({
  components: {
    BaseHeading,
    BaseDialog
  },

  emits: ['uploaded', 'deleted', 'close'],

  setup(_, context) {
    const memberStore = useMemberStore()
    const { idToken, photoURL } = storeToRefs(memberStore)

    const { t } = useI18n()
    const globalLoader = useGlobalLoaderStore()
    const { notify } = useToast()

    const uploadConfig = getUploadConfigs()
    const errorMsg = ref<string>('')

    console.log('uploadConfig', bytesFormat(uploadConfig.maxFileSize))

    const uploadFile = async (file) => {
      if (!uploadConfig.acceptMimeType.split(',').includes(file.type)) {
        errorMsg.value = t('msg.notAcceptedTypeOnUpload', { types: 'PNG, JPG, GIF' })
        return
      }
      if (file.size > uploadConfig.maxFileSize) {
        errorMsg.value = t('msg.overMaxSizeOnUpload', {
          max: bytesFormat(uploadConfig.maxFileSize)
        })
        return
      }

      try {
        globalLoader.updateLoading(true)
        const photoURL = await MemberProfileApi.uploadImage('profile', file, idToken.value)
        globalLoader.updateLoading(false)
        context.emit('uploaded', photoURL)
      } catch (error) {
        console.error(error)
        notify(t('msg.uploadFailed'), 'error')
        globalLoader.updateLoading(false)
      }
    }

    const selectFile = async (event: Event) => {
      errorMsg.value = ''
      const input = event.target as HTMLInputElement
      if (!input.files) {
        errorMsg.value = t('msg.selectItem', { label: t('common.file') })
        return
      }
      const file = input.files[0]
      uploadFile(file)
    }

    const isDragOver = ref<boolean>(false)
    const dragOver = () => {
      isDragOver.value = true
    }
    const dragLeave = () => {
      isDragOver.value = false
    }
    const dropFiles = (event: DragEvent) => {
      isDragOver.value = false
      const droppedFiles = event.dataTransfer?.files
      if (droppedFiles == null || (droppedFiles && droppedFiles.length === 0)) {
        errorMsg.value = t('msg.selectItem', { label: t('common.file') })
        return
      }
      // files.value = [...files.value, ...Array.from(droppedFiles)]
      const file = droppedFiles[0]
      uploadFile(file)
    }

    const closeModal = () => {
      context.emit('close')
    }

    const isDisabledDeleteButton = computed(() => {
      return !photoURL.value
    })
    const isActiveDeleteDialog = ref<boolean>(false)
    const openDeleteDialog = () => {
      if (isDisabledDeleteButton.value) return
      isActiveDeleteDialog.value = true
    }
    const deleteImage = async () => {
      try {
        globalLoader.updateLoading(true)
        await MemberProfileApi.deleteImage('profile', idToken.value)
        globalLoader.updateLoading(false)
        context.emit('deleted')
      } catch (error) {
        console.error(error)
        notify(t('msg.deleteFailed'), 'error')
        globalLoader.updateLoading(false)
      }
    }

    return {
      errorMsg,
      uploadConfig,
      selectFile,
      isDragOver,
      dragOver,
      dragLeave,
      dropFiles,
      closeModal,
      isActiveDeleteDialog,
      isDisabledDeleteButton,
      openDeleteDialog,
      deleteImage,
      bytesFormat
    }
  }
})
</script>

<template>
  <ul class="text-sm font-medium text-gray-900 bg-white dark:bg-gray-700 dark:text-white">
    <li class="w-full border-gray-200 rounded-t-lg dark:border-gray-600">
      <label
        for="dropzone-file"
        class="flex flex-col items-center justify-center w-full min-h-fit cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
        @dragover.prevent="dragOver"
        @dragleave.prevent="dragLeave"
        @drop.prevent="dropFiles"
        :class="{ 'drag-over': isDragOver }"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6 px-2">
          <FontAwesomeIcon
            icon="cloud-arrow-up"
            class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          />
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {{ $t('form.selectFilesDragAndDrop') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG or GIF ({{ $t('common.max') }}
            <span v-text="bytesFormat(uploadConfig.maxFileSize)"></span>)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          class="hidden"
          :accept="uploadConfig.acceptMimeType"
          @change="selectFile"
        />
      </label>
      <p
        v-if="errorMsg"
        class="p-2 text-center text-sm text-danger-500"
      >
        {{ errorMsg }}
      </p>
    </li>
    <li class="mt-2 border-b border-gray-200 dark:border-gray-600">
      <button
        class="w-full p-4 text-center text-md font-bold text-danger-500"
        :class="{ 'cursor-not-allowed text-danger-300': isDisabledDeleteButton }"
        :disabled="isDisabledDeleteButton"
        @click="openDeleteDialog"
      >
        {{ $t('common.deleteFor', { label: $t('form.currentImage') }) }}
      </button>
      <BaseDialog
        :is-active="isActiveDeleteDialog"
        @close="isActiveDeleteDialog = false"
        @confirmed="deleteImage"
      >
        <p>{{ $t('msg.cofirmToDelete') }}</p>
      </BaseDialog>
    </li>
    <li class="rounded-b-lg">
      <button
        class="w-full p-4 text-center text-md"
        @click="closeModal"
      >
        {{ $t('common.cancel') }}
      </button>
    </li>
  </ul>
</template>
