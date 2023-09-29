<script lang="ts">
import { defineComponent } from 'vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'
import UserProfile from '@/components/organisms/UserProfile.vue'

export default defineComponent({
  components: {
    BaseHeading,
    UserProfile
  }
})
</script>

<template>
  <UserProfile />
</template>
