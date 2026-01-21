import { handlerCreateUser } from "@/handlers/users";
import { useUserStore } from "#imports";
import { useAlert } from "#imports";

export default function useRegister() {
  const userStore = useUserStore();
  const { showAlert } = useAlert();

  const register = async (
    name: string,
    email: string,
    password: string,
    t: (key: string) => string,
  ) => {
    try {
      const response = await handlerCreateUser({
        name,
        email,
        password,
      });

      if (response?.username) userStore.setName(response.username as string);
      if (response?.storage?.id) userStore.setStorage(response.storage.id as string);
      if (response?.stats?.elo !== undefined) userStore.setElo(response.stats.elo as number);
      if (response?.stats?.money !== undefined) userStore.setMoney(response.stats.money as number);
      if (response?.stats?.total_games !== undefined)
        userStore.setTotalGames(response.stats.total_games as number);

      return true;
    } catch (error: any) {
      showAlert({
        message: error?.message ?? t("warnings.auth.registerFailed"),
        statusCode: error?.status ?? 400,
      });
      return false;
    }
  };

  return { register };
}
