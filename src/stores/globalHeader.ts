import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalHeaderStore = defineStore('globalHeader', () => {
  const isMenuOpen = ref(false)
  const updateMenuOpenStatus = (status: boolean): void => {
    isMenuOpen.value = status
  }

  const isActiveMemberDropdown = ref<boolean>(false)
  const updateMemberDropdownStatus = (status: boolean): void => {
    isActiveMemberDropdown.value = status
  }

  return {
    isMenuOpen,
    updateMenuOpenStatus,
    isActiveMemberDropdown,
    updateMemberDropdownStatus
  }
})
