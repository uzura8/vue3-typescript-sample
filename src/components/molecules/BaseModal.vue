<script lang="ts">
import { defineComponent, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default defineComponent({
  components: {},

  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    maxWidth: {
      type: String,
      default: '3xl'
    },
    isDialogMode: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const closeModal = () => {
      context.emit('close')
    }

    const modalContent = ref<HTMLElement | null>(null)

    onClickOutside(modalContent, () => {
      if (props.isDialogMode) return
      closeModal()
    })

    return {
      modalContent,
      closeModal
    }
  }
})
</script>

<template>
  <div
    v-show="isActive"
    id="defaultModal"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-40 w-full p-4 overflow-x-hidden overflow-y-auto bg-gray-700 bg-opacity-50 md:inset-0 h-[calc(100%)] max-h-full flex items-center justify-center"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Modal content -->
    <div
      class="relative px-5 py-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 min-w-xs sm:p-5 max-h-[calc(100vh-2rem)] overflow-y-auto"
      :class="`max-w-${maxWidth}`"
      ref="modalContent"
    >
      <h3
        v-if="title"
        class="text-lg font-semibold dark:text-white"
      >
        {{ title }}
      </h3>

      <button
        v-if="isDialogMode === false"
        type="button"
        class="absolute top-2.5 right-2.5 text-gray-400 bg-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        data-modal-toggle="deleteModal"
        @click="closeModal"
      >
        <FontAwesomeIcon
          icon="xmark"
          class="w-5 h-5"
        />
        <span class="sr-only">Close modal</span>
      </button>

      <div class="text-left mt-4 text-gray-600 dark:text-gray-400">
        <slot></slot>
      </div>

      <slot name="footer"></slot>
    </div>
  </div>
</template>
