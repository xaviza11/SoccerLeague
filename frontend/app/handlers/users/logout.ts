import { useGameDataStore, useUserStore } from "#imports";

export const handlerLogout = async (): Promise<any> => {
  await $fetch("/api/auth/logout");
  clearStores();
  return
};

function clearStores() {
  const useGameData = useGameDataStore();
  const useUser = useUserStore();

  useGameData.resetGameData();
  useUser.reset();
}