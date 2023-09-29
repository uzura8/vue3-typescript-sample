<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useMemberStore } from '@/stores/member'
import LinkToSendEmailVerification from '@/components/molecules/LinkToSendEmailVerification.vue'

export default defineComponent({
  components: {
    LinkToSendEmailVerification
  },

  setup() {
    const memberStore = useMemberStore()
    const { member } = memberStore

    const emailVerified = computed(() => {
      if (!member) return false
      return member.emailVerified
    })

    const email = ref<string>(member?.email || '')

    return {
      email,
      emailVerified
    }
  }
})
</script>

<template>
  <div class="flex flex-col py-4">
    <dt class="mb-1 text-gray-500 dark:text-gray-400">
      {{ $t('common.email') }}
    </dt>
    <dd>
      <div class="text-lg font-medium flex justify-between items-center">
        <span class="truncate w-full">{{ email }}</span>
        <RouterLink
          to="/member/settings/email"
          class="text-sm text-primary-600 dark:text-primary-500 hover:underline whitespace-nowrap"
        >
          {{ $t('common.change') }}
        </RouterLink>
      </div>
      <div>
        <span
          v-if="emailVerified"
          class="text-sm text-green-500"
        >
          <FontAwesomeIcon icon="check-circle" />
          {{ $t('common.verified') }}
        </span>
        <span
          v-else
          class="text-sm text-danger-600"
        >
          <FontAwesomeIcon icon="circle-exclamation" />
          {{ $t('common.notVerified') }}
        </span>
        <LinkToSendEmailVerification
          v-if="!emailVerified"
          class="text-sm ml-4"
        />
      </div>
    </dd>
  </div>
</template>
