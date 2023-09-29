<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    label: {
      type: String
    },
    isBorder: {
      type: Boolean,
      default: false
    },
    isRound: {
      type: Boolean,
      default: false
    }
  },

  setup() {}
})
</script>

<template>
  <span
    class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 dark:bg-gray-700 dark:text-gray-400"
    :class="{
      'rounded border border-gray-500': isBorder,
      'rounded-full': isRound
    }"
  >
    {{ label }}
  </span>
</template>
