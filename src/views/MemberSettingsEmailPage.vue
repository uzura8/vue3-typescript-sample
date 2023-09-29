<script lang="ts">
import { defineComponent } from 'vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'
import MemberSettingEmailForm from '@/components/organisms/MemberSettingEmailForm.vue'

export default defineComponent({
  components: {
    BaseHeading,
    MemberSettingEmailForm
  }
})
</script>

<template>
  <div class="main-container">
    <BaseHeading>{{ $t('common.changeOf', { label: $t('common.email') }) }}</BaseHeading>
    <MemberSettingEmailForm class="mt-12" />
  </div>
</template>
