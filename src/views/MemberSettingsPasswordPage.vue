<script lang="ts">
import { defineComponent } from 'vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'
import MemberSettingPasswordForm from '@/components/organisms/MemberSettingPasswordForm.vue'

export default defineComponent({
  components: {
    BaseHeading,
    MemberSettingPasswordForm
  }
})
</script>

<template>
  <div class="main-container">
    <BaseHeading>{{ $t('common.changeOf', { label: $t('common.password') }) }}</BaseHeading>
    <MemberSettingPasswordForm class="mt-12" />
  </div>
</template>
