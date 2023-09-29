<script lang="ts">
import { defineComponent } from 'vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'
import MemberSettingsList from '@/components/organisms/MemberSettingsList.vue'

export default defineComponent({
  components: {
    BaseHeading,
    MemberSettingsList
  }
})
</script>

<template>
  <div class="main-container">
    <nav>
      <RouterLink
        :to="`/member`"
        class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
      >
        <FontAwesomeIcon icon="chevron-left" />
        <span class="ml-1">
          {{ $t('page.userTop') }}
        </span>
      </RouterLink>
    </nav>
    <BaseHeading class="mt-8">{{ $t('page.settings') }}</BaseHeading>
    <MemberSettingsList />
  </div>
</template>
