<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalLoaderStore } from '@/stores/globalLoader.js'
import LoadingSpinner from '@/components/molecules/LoadingSpinner.vue'
import MainFooter from '@/components/molecules/MainFooter.vue'

export default defineComponent({
  components: {
    LoadingSpinner,
    MainFooter
  },

  setup() {
    // store
    const loader = useGlobalLoaderStore()
    const { isLoading: isGlobalLoading } = storeToRefs(loader)

    return { isGlobalLoading }
  }
})
</script>

<template>
  <div v-cloak>
    <LoadingSpinner
      v-if="isGlobalLoading"
      :is-fullscreen="true"
    />
    <div class="flex flex-col h-screen">
      <div class="flex-1">
        <div class="h-14 font-semibold text-gray-600 dark:text-white">
          <RouterLink
            class="inline-block py-3 px-6"
            to="/"
          >
            {{ $t('sl.serviceName') }}
          </RouterLink>
        </div>
        <main class="p-4 flex justify-center items-center">
          <RouterView />
        </main>
      </div>
      <MainFooter />
    </div>
  </div>
</template>
