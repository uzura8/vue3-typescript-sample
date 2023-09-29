<script lang="ts">
import { defineComponent } from 'vue'
import SignInForm from '@/components/organisms/SignInForm.vue'

export default defineComponent({
  components: {
    SignInForm
  }
})
</script>

<template>
  <div class="main-container">
    <SignInForm />
  </div>
</template>
