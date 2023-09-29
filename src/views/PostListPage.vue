<script lang="ts">
import { defineComponent } from 'vue'
import { config } from '@/configs'
import PostList from '@/components/organisms/PostList.vue'
import BaseHeading from '@/components/atoms/BaseHeading.vue'

export default defineComponent({
  components: {
    BaseHeading,
    PostList
  },

  setup() {
    const serviceId = config.post.serviceId

    return {
      serviceId
    }
  }
})
</script>

<template>
  <div class="main-container">
    <BaseHeading>{{ $t('term.postList') }}</BaseHeading>
    <div class="container mx-auto py-8">
      <PostList :service-id="serviceId" />
    </div>
  </div>
</template>
