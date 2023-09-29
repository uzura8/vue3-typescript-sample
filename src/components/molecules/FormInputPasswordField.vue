<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

export default defineComponent({
  props: {
    inputClass: {
      type: String,
      default: ''
    },
    isWidthFull: {
      type: Boolean,
      default: true
    },
    labelText: {
      type: String,
      required: false,
      default: ''
    },
    errorText: {
      type: String,
      default: ''
    },
    helperText: {
      type: String,
      default: ''
    },
    helperTexts: {
      type: Array,
      default: []
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    modelValue: String
  },

  setup(props, context) {
    const inputValue = ref(props.modelValue)
    const showPassword = ref<boolean>(false)

    const inputClassStr = computed(() => {
      let classes = props.inputClass ? props.inputClass.split(' ') : []
      if (props.isWidthFull) {
        classes.push('w-full')
      }
      if (props.errorText) {
        classes = classes.concat([
          'bg-red-50',
          'border-red-500',
          'text-red-900',
          'placeholder-red-700',
          'focus:ring-red-500',
          'focus:border-red-500',
          'dark:text-red-500',
          'dark:placeholder-red-500',
          'dark:border-red-500'
        ])
      } else {
        classes = classes.concat(['border-gray-300'])
      }
      return classes.join(' ')
    })

    watch(
      () => props.modelValue,
      (value) => {
        inputValue.value = value
      }
    )

    watch(inputValue, (value) => {
      context.emit('update:modelValue', value)
    })

    return {
      inputValue,
      showPassword,
      inputClassStr
    }
  }
})
</script>

<template>
  <div>
    <label
      v-if="labelText"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      :class="{ 'text-red-600': errorText, 'dark:text-red-500': errorText }"
    >
      <span>{{ labelText }}</span>
      <span
        v-if="isRequired"
        class="text-red-700 text-xs ml-2"
      >
        {{ $t('form.required') }}
      </span>
    </label>

    <div class="relative">
      <input
        v-model="inputValue"
        @blur="$emit('blur', inputValue)"
        :type="showPassword ? 'text' : 'password'"
        class="bg-gray-50 border text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        :class="inputClassStr"
      />
      <button
        @click="showPassword = !showPassword"
        class="absolute inset-y-0 right-0 flex items-center cursor-pointer pr-3 text-primary-600"
        type="button"
      >
        <FontAwesomeIcon
          v-if="!showPassword"
          class="w-5 h-5"
          icon="eye"
        />
        <FontAwesomeIcon
          v-else
          class="w-5 h-5"
          icon="eye-slash"
        />
      </button>
    </div>
    <p
      v-if="errorText"
      class="mt-2 text-sm text-red-600 dark:text-red-500"
    >
      {{ errorText }}
    </p>
    <p
      v-if="helperText"
      class="mt-2 text-xs text-gray-500 dark:text-gray-400"
    >
      {{ helperText }}
    </p>
    <div
      v-if="helperTexts"
      class="mt-2 text-xs text-gray-500 dark:text-gray-400"
    >
      <div
        v-for="(helperText, index) in helperTexts"
        :key="index"
        :class="{ 'mt-2': index > 0 }"
      >
        {{ helperText }}
      </div>
    </div>
  </div>
</template>
