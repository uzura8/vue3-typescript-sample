<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    textSize: {
      type: String,
      default: 'text-2xl'
    }
  }
})
</script>

<template>
  <h1
    :class="textSize"
    class="font-semibold dark:text-white"
  >
    <slot></slot>
  </h1>
</template>
