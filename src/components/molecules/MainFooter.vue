<script lang="ts">
import { defineComponent, computed } from 'vue'
import config from '@/configs/config.json'

export default defineComponent({
  setup() {
    const footerRight = computed((): string => config.site.footerRight)
    return { footerRight }
  }
})
</script>

<template>
  <footer class="w-full max-w-[85rem] pt-8 pb-4 px-4 sm:px-6 lg:px-8 mx-auto">
    <div class="text-center">
      <div class="mt-3">
        <p
          class="text-gray-500"
          v-html="footerRight"
        ></p>
      </div>
    </div>
  </footer>
</template>
