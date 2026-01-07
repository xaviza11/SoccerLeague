import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const name = ref<string | null>(null)
  
  function setName(newName: string) {
    name.value = newName
  }

  function reset() {
    name.value = null
  }

  return { name, setName, reset }
}, {
  persist: true 
})