<script lang="ts">
import { defineComponent, ref, computed, onBeforeMount, onMounted, watch } from 'vue'
import FormInputNumberField from '@/components/molecules/FormInputNumberField.vue'

export default defineComponent({
  components: {
    FormInputNumberField
  },

  props: {
    itemId: {
      type: Number,
      required: true
    },
    itemName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    clickMode: {
      type: String,
      required: true,
      default: 'toggle'
    }
  },

  setup(props, context) {
    const inputQuantity = ref<number>(0)
    watch(
      () => inputQuantity.value,
      (value) => {
        console.log(value)
      }
    )

    const isModalActive = ref<boolean>(false)

    const hideModal = () => {
      isModalActive.value = false
      inputQuantity.value = 0
    }

    const isOnCart = computed(() => {
      return props.quantity > 0
    })

    const applyInputQuantity = () => {
      if (inputQuantity.value !== props.quantity) {
        context.emit('updateQuantity', { itemId: props.itemId, quantity: inputQuantity.value })
      }
      hideModal()
    }

    const toggleCart = () => {
      if (props.quantity > 0) {
        context.emit('updateQuantity', { itemId: props.itemId, quantity: 0 })
      } else {
        context.emit('updateQuantity', { itemId: props.itemId, quantity: props.quantity + 1 })
      }
    }

    const deleteCart = () => {
      context.emit('updateQuantity', { itemId: props.itemId, quantity: 0 })
      hideModal()
    }

    const addCart = () => {
      if (props.quantity === 0) {
        context.emit('updateQuantity', { itemId: props.itemId, quantity: 1 })
      } else {
        confirmCart()
      }
    }

    const confirmCart = () => {
      inputQuantity.value = props.quantity ? props.quantity : 1
      isModalActive.value = true
    }

    const handleCartAction = () => {
      if (props.clickMode === 'toggle') {
        toggleCart()
      } else if (props.clickMode === 'add') {
        addCart()
      } else {
        confirmCart()
      }
    }

    const isDoubleClick = ref<boolean>(false)
    const timer = ref<number>(0)

    const handleClickEvent = () => {
      timer.value = setTimeout(() => {
        if (!isDoubleClick.value) {
          handleCartAction()
        }
        isDoubleClick.value = false // Reset double click flag
      }, 200) // You may need to adjust this delay
    }

    const handleDoubleClickEvent = () => {
      clearTimeout(timer.value) // Cancel the single click event
      isDoubleClick.value = true // Set double click flag
      confirmCart()
    }

    onBeforeMount(async () => {})

    onMounted(() => {})

    return {
      isOnCart,
      isModalActive,
      inputQuantity,
      hideModal,
      deleteCart,
      applyInputQuantity,
      handleClickEvent,
      handleDoubleClickEvent
    }
  }
})
</script>

<template>
  <div
    class="cursor-pointer"
    :class="{ 'bg-red-200': isOnCart }"
    @click="handleClickEvent"
    @dblclick="handleDoubleClickEvent"
    v-touch:longtap="handleDoubleClickEvent"
  >
    {{ itemId }}
  </div>

  <!-- Main modal -->
  <div
    v-show="isModalActive"
    class="fixed z-40 inset-0 overflow-y-auto bg-gray-700 bg-opacity-20"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      @click.self="hideModal"
      class="absolute inset-0 flex items-center justify-center px-2"
    >
      <div
        class="max-w-xl p-4 rounded-md shadow-xl modal-content"
        :class="{ 'bg-yellow-50': isOnCart, 'bg-white': !isOnCart }"
      >
        <div class="flex justify-between">
          <h3 class="text-lg text-left">
            <div class="pt-2">
              <a class="cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">
                {{ itemName }}
              </a>
            </div>
          </h3>
          <FontAwesomeIcon
            icon="fa-xmark"
            @click="hideModal"
            class="w-6 h-6 ml-3 text-gray-400 cursor-pointer"
          />
        </div>
        <div class="mt-4 text-left leading-normal">
          <div>
            <a class="text-sm cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">
              クチコミ (105件)
            </a>
          </div>

          <div class="mt-1">
            <FontAwesomeIcon
              icon="fa-regular fa-heart"
              class="w-6 h-6 text-gray-400 cursor-pointer"
            />
          </div>
          <div
            v-if="clickMode !== 'confirm' || !isOnCart"
            class="flex justify-end"
          >
            <div class="block max-w-32">
              <FormInputNumberField
                v-model="inputQuantity"
                input-class="w-24 py-2"
              />
            </div>
            <div class="block pl-8">
              <button
                type="button"
                class="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-sm text-sm px-8 py-3 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                @click="applyInputQuantity"
              >
                カゴへ
              </button>
            </div>
          </div>

          <div
            v-if="isOnCart"
            class="mt-4"
          >
            <div class="text-right pt-4 border-t border-gray-300">
              <label class="p-2 text-gray-600 dark:text-gray-400">買い物かご</label>
              <span class="ml-2 p-2">
                <span class="text-xl font-semibold text-gray-600 dark:text-gray-400">{{
                  quantity
                }}</span>
                <span class="ml-1 text-sm text-gray-600 dark:text-gray-400">点</span>
              </span>
              <a
                @click="deleteCart"
                class="cursor-pointer ml-1 p-2 text-blue-600 dark:text-blue-500 hover:underline"
              >
                削除
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
