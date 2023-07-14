<script lang="ts">
import type { ClickMode, ItemOnCart } from '@/types/Service'
import { defineComponent, ref, computed, onBeforeMount, onMounted, watch } from 'vue'
import ItemListItem from '@/components/molecules/ItemListItem.vue'
import FormSelectField from '@/components/molecules/FormSelectField.vue'

type Item = {
  itemId: number
  itemName: string
}

export default defineComponent({
  components: {
    ItemListItem,
    FormSelectField
  },

  setup() {
    const itemCountPerPage = 20

    const items = ref<Item[]>([])
    const itemsOnCart = ref<ItemOnCart[]>([])
    const itemIdsOnCart = computed((): number[] => itemsOnCart.value.map((item) => item.itemId))

    const resetItems = () => {
      itemsOnCart.value = []
      items.value = []
      for (let i = 1; i <= itemCountPerPage; i++) {
        items.value.push({
          itemId: i,
          itemName: `Item ${i} の商品名です Item ${i} の商品名です Item ${i} の商品名です `
        })
      }
    }

    watch(
      () => itemsOnCart.value,
      (value) => {
        console.log(value)
      },
      { deep: true }
    )

    const clickMode = ref<ClickMode>('toggle')
    const clickModeOptions = ref<ClickMode[]>(['toggle', 'add', 'confirm'])
    watch(
      () => clickMode.value,
      () => {
        resetItems()
      }
    )

    const handleItem = (itemId: number) => {
      const itemOnCart = itemsOnCart.value.find((item) => item.itemId === itemId)
      if (itemOnCart) {
        itemOnCart.quantity += 1
      } else {
        itemsOnCart.value.push({
          itemId,
          quantity: 1
        })
      }
    }

    const updateCart = (ev: ItemOnCart) => {
      const itemId = ev.itemId
      let quantity = ev.quantity
      if (quantity < 0) quantity = 0
      if (quantity === 0) {
        const itemOnCartIndex = itemsOnCart.value.findIndex((item) => item.itemId === itemId)
        if (itemOnCartIndex !== -1) {
          itemsOnCart.value.splice(itemOnCartIndex, 1)
        }
      } else {
        const itemOnCart = itemsOnCart.value.find((item) => item.itemId === itemId)
        if (itemOnCart) {
          itemOnCart.quantity = quantity
        } else {
          itemsOnCart.value.push({
            itemId,
            quantity
          })
        }
      }
    }

    onBeforeMount(async () => {
      resetItems()
    })

    onMounted(() => {})

    return {
      clickMode,
      clickModeOptions,
      items,
      itemIdsOnCart,
      itemsOnCart,
      updateCart,
      handleItem
    }
  }
})
</script>

<template>
  <div class="py-8">
    <FormSelectField
      v-model="clickMode"
      label-text="Mode"
      :options="clickModeOptions"
      :is-inline="true"
      class="max-w-xl"
    />
  </div>
  <ul class="flex flex-wrap custom-flex-container">
    <li
      v-for="item in items"
      :key="item.itemId"
      class="list-cell w-12 h-12"
    >
      <ItemListItem
        :item-id="item.itemId"
        :item-name="item.itemName"
        :quantity="
          itemsOnCart.find((itemOnCart) => itemOnCart.itemId === item.itemId)?.quantity || 0
        "
        :click-mode="clickMode"
        @update-quantity="updateCart"
      />
    </li>
  </ul>
</template>

<style scoped>
.custom-flex-container {
  border-left: 1px solid #e8e8e8;
}
.list-cell {
  flex: 0 0 160px;
  height: 200px;
  text-align: center;
  vertical-align: middle;
  line-height: 200px;
  margin: -1px -1px 0;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
</style>
