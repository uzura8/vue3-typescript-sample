<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},

  setup() {
    return {}
  }
})
</script>

<template>
  <div class="flex flex-col py-4">
    <dt class="mb-1 text-gray-500 dark:text-gray-400">
      {{ $t('common.password') }}
    </dt>
    <dd>
      <div class="text-lg font-medium flex justify-between items-center">
        <span class="truncate w-full text-sm italic">{{ $t('form.maskedForSecurity') }}</span>
        <RouterLink
          to="/member/settings/password"
          class="text-sm text-primary-600 dark:text-primary-500 hover:underline whitespace-nowrap"
        >
          {{ $t('common.change') }}
        </RouterLink>
      </div>
    </dd>
  </div>
</template>
