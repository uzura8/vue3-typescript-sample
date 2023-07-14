<script lang="ts">
import type { ClickMode, ItemOnCart } from '@/types/Service'
import { defineComponent, ref, computed, onBeforeMount, onMounted, watch } from 'vue'
import ItemListItem from '@/components/molecules/ItemListItem.vue'
import FormSelectField from '@/components/molecules/FormSelectField.vue'
import { getRandomInt } from '@/utils/number'
import { numFormat } from '@/utils/str'

type Item = {
  itemId: number
  itemName: string
  price: number
}

export default defineComponent({
  components: {
    ItemListItem,
    FormSelectField
  },

  setup() {
    const itemCountPerPage = 40

    const items = ref<Item[]>([])
    const itemsOnCart = ref<ItemOnCart[]>([])
    const itemIdsOnCart = computed((): number[] => itemsOnCart.value.map((item) => item.itemId))
    const totalQuantity = computed((): number =>
      itemsOnCart.value.reduce((total: number, obj: ItemOnCart) => total + obj.quantity, 0)
    )
    const totalAmount = computed((): number =>
      itemsOnCart.value.reduce((total: number, obj: ItemOnCart) => {
        const item = items.value.find((item) => item.itemId === obj.itemId)
        if (!item) return total
        return total + obj.quantity * item.price
      }, 0)
    )

    const resetItems = () => {
      itemsOnCart.value = []
      items.value = []
      for (let i = 1; i <= itemCountPerPage; i++) {
        items.value.push({
          itemId: i,
          price: getRandomInt(100, 1000),
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
      totalQuantity,
      totalAmount,
      numFormat,
      updateCart,
      handleItem
    }
  }
})
</script>

<template>
  <div class="py-4">
    <FormSelectField
      v-model="clickMode"
      label-text="Mode"
      :options="clickModeOptions"
      :is-inline="true"
      class="max-w-xl"
    />
  </div>
  <div class="py-4 mt-2">
    <button type="button"></button>
    <button
      type="button"
      class="inline-flex items-baseline px-5 py-2.5 text-sm font-medium text-center text-gray-900 hover:text-white rounded-lg border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
    >
      <FontAwesomeIcon
        icon="fa-cart-shopping"
        class="w-5 h-5 mr-2"
      />
      <span class="text-xs lea1ing-6">税込</span>
      <span class="text-lg ml-1">{{ numFormat(totalAmount) }}</span>
      <span class="text-xs ml-1">円</span>
      <span
        class="inline-flex items-center justify-center w-6 h-6 ml-2 text-base font-semibold text-white bg-red-600 rounded-full"
      >
        {{ totalQuantity }}
      </span>
    </button>
  </div>
  <ul class="flex flex-wrap custom-flex-container">
    <li
      v-for="item in items"
      :key="item.itemId"
      class="list-cell"
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
