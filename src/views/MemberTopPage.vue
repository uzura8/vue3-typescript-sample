<script lang="ts">
import { defineComponent } from 'vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'

export default defineComponent({
  components: {
    BaseHeading
  }
})
</script>

<template>
  <div class="main-container">
    <BaseHeading class="mt-8">{{ $t('page.userTop') }}</BaseHeading>
  </div>
</template>
