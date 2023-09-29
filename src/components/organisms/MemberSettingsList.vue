<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import MemberSettingsListItemDisplayName from '@/components/organisms/MemberSettingsListItemDisplayName.vue'
import MemberSettingsListItemEmail from '@/components/organisms/MemberSettingsListItemEmail.vue'
import MemberSettingsListItemPassword from './MemberSettingsListItemPassword.vue'

export default defineComponent({
  components: {
    MemberSettingsListItemDisplayName,
    MemberSettingsListItemEmail,
    MemberSettingsListItemPassword
  },

  setup() {
    const memberStore = useMemberStore()
    const { username } = storeToRefs(memberStore)

    return {
      username
    }
  }
})
</script>

<template>
  <dl class="mt-12 text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
    <MemberSettingsListItemEmail />
    <MemberSettingsListItemPassword />

    <div class="flex flex-col py-4">
      <dt class="mb-1 text-gray-500 dark:text-gray-400">{{ $t('common.username') }}</dt>
      <dd class="text-lg font-medium">
        <div>
          <div>{{ username }}</div>
          <div class="mt-1 text-sm italic">{{ $t('form.attentionForUsername') }}</div>
        </div>
      </dd>
    </div>

    <MemberSettingsListItemDisplayName />
  </dl>
</template>
