<script lang="ts">
import { defineComponent } from 'vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'
import MemberRegisterForm from '@/components/organisms/MemberRegisterForm.vue'

export default defineComponent({
  components: {
    BaseHeading,
    MemberRegisterForm
  }
})
</script>

<template>
  <div class="main-container">
    <div class="w-full max-w-2xl flex flex-col">
      <BaseHeading class="mt-8">
        {{ $t('common.registerOf', { label: $t('common.accountInfo') }) }}
      </BaseHeading>
      <MemberRegisterForm class="mt-12" />
    </div>
  </div>
</template>
