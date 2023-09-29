<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import BaseHeading from '@/components/atoms/BaseHeading.vue'

export default defineComponent({
  components: {
    BaseHeading
  },

  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const mode = computed(() => {
      if (!route.query.mode || typeof route.query.mode !== 'string') return ''
      return route.query.mode
    })

    const title = computed(() => {
      switch (mode.value) {
        case 'resetPassword':
          return t('page.passwordReset')
        case 'verifyEmail':
          return t('page.emailVerification')
        default:
          return ''
      }
    })

    return {
      title
    }
  }
})
</script>

<template>
  <div class="main-container">
    <BaseHeading>{{ title }}</BaseHeading>
    <p class="mt-12">{{ $t('msg.sentVerificationEmail') }}</p>
  </div>
</template>
