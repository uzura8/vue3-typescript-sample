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
    <BaseHeading>{{ $t('page.about') }}</BaseHeading>
  </div>
</template>
