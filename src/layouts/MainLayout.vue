<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import { useGlobalLoaderStore } from '@/stores/globalLoader.js'
import LoadingSpinner from '@/components/molecules/LoadingSpinner.vue'
import MainHeader from '@/components/molecules/MainHeader.vue'
// import MainSidebar from '@/components/molecules/MainSidebar.vue'
import MainFooter from '@/components/molecules/MainFooter.vue'
import LinkToSendEmailVerification from '@/components/molecules/LinkToSendEmailVerification.vue'

export default defineComponent({
  components: {
    LoadingSpinner,
    MainHeader,
    // MainSidebar,
    MainFooter,
    LinkToSendEmailVerification
  },

  setup() {
    const loader = useGlobalLoaderStore()
    const { isLoading: isGlobalLoading } = storeToRefs(loader)

    const memberStore = useMemberStore()
    const { isAuth, emailVerified } = storeToRefs(memberStore)

    return {
      isGlobalLoading,
      isAuth,
      emailVerified
    }
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
      <div
        v-if="isAuth && !emailVerified"
        class="py-2 px-10 bg-warning-100 text-center text-xs text-warning-800"
      >
        {{ $t('msg.emailNotVerified') }}
        <LinkToSendEmailVerification class="ml-2" />
      </div>
      <MainHeader />

      <div class="flex-1">
        <div class="h-full max-w-[85rem] mx-auto">
          <main class="px-6 py-8">
            <RouterView />
          </main>
        </div>
      </div>

      <MainFooter />
    </div>
  </div>
</template>
