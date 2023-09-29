<script lang="ts">
import { defineComponent } from 'vue'
import ResetPasswordForm from '@/components/organisms/ResetPasswordForm.vue'

export default defineComponent({
  components: {
    ResetPasswordForm
  }
})
</script>

<template>
  <div class="main-container">
    <ResetPasswordForm />
  </div>
</template>
