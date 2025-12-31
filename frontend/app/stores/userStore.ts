import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const name = ref<string | null>(null)
  
  function setName(newName: string) {
    name.value = newName
  }

  return { name, setName }
}, {
  persist: true 
})