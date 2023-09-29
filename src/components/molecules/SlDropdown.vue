<script lang="ts">
import { defineComponent, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { buttonClass } from '@/utils/style'

export default defineComponent({
  props: {
    buttonType: {
      type: String,
      required: false,
      default: 'light'
    },
    buttonSize: {
      type: String,
      required: false,
      default: 'sm'
    },
    withCarets: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  setup() {
    const isActive = ref<boolean>(false)
    const dropdownContainer = ref<HTMLElement | null>(null)
    onClickOutside(dropdownContainer, () => {
      isActive.value = false
    })

    return {
      isActive,
      dropdownContainer,
      buttonClass
    }
  }
})
</script>

<template>
  <div
    class="flex justify-end relative"
    ref="dropdownContainer"
  >
    <button
      type="button"
      :class="buttonClass(buttonType, buttonSize)"
      @click="isActive = !isActive"
    >
      <slot name="button"></slot>
      <span
        v-if="withCarets"
        class="ml-3 mt-0.5"
      >
        <FontAwesomeIcon
          v-if="!isActive"
          icon="chevron-down"
        />
        <FontAwesomeIcon
          v-else
          icon="chevron-up"
        />
      </span>
    </button>
    <!-- Dropdown menu -->
    <div
      class="z-10 absolute right-0 mt-11 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
      :class="{ hidden: !isActive, block: isActive }"
    >
      <div
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <slot name="menu"></slot>
      </div>
    </div>
  </div>
</template>
