<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { buttonClass } from '@/utils/style'
import BaseModal from '@/components/molecules/BaseModal.vue'

export default defineComponent({
  components: {
    BaseModal
  },

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
    confirmLabel: {
      type: String,
      default: ''
    },
    confirmType: {
      type: String,
      default: 'danger'
    },
    cancelLabel: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const { t } = useI18n()

    const confirm = () => {
      context.emit('confirmed')
    }

    const closeModal = () => {
      context.emit('close')
    }

    const confirmBtnLabel = computed(() => {
      return props.confirmLabel || t('common.yes')
    })
    const cancelBtnLabel = computed(() => {
      return props.cancelLabel || t('common.cancel')
    })

    return {
      confirmBtnLabel,
      cancelBtnLabel,
      buttonClass,
      confirm,
      closeModal
    }
  }
})
</script>

<template>
  <BaseModal
    :is-active="isActive"
    :is-dialog-mode="true"
    :title="title"
    :max-width="maxWidth"
    @close="closeModal"
  >
    <slot></slot>
    <template #footer>
      <div class="flex justify-center items-center space-x-4 py-2">
        <button
          data-modal-toggle="deleteModal"
          type="button"
          :class="buttonClass()"
          @click="closeModal"
        >
          {{ cancelBtnLabel }}
        </button>
        <button
          type="submit"
          class="min-w-100"
          :class="buttonClass(confirmType)"
          @click="confirm"
        >
          {{ confirmBtnLabel }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
