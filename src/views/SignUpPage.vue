<script lang="ts">
import { defineComponent } from 'vue'
import SignUpForm from '@/components/organisms/SignUpForm.vue'

export default defineComponent({
  components: {
    SignUpForm
  }
})
</script>

<template>
  <div class="main-container">
    <SignUpForm />
  </div>
</template>
