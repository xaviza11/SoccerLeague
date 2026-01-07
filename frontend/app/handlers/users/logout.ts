export const handlerLogout = async (): Promise<any> => {
  try {
    return await $fetch('/api/auth/logout')
  } catch (error: any) {
    throw error
  }
}
