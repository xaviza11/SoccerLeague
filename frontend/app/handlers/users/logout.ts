export const handlerLogout = async (): Promise<any> => {
  return await $fetch("/api/auth/logout");
};
