import { handlerRetrieveGameData } from "@/handlers/gameData";
import { useGameDataStore } from "#imports";
import { useAlert } from "#imports";

export default function useRetrieveGameData() {
  const gameDataStore = useGameDataStore();
  const { showAlert } = useAlert();

  const retrieveGameData = async (t: (key: string) => string) => {
    try {
      const response = await handlerRetrieveGameData();
      gameDataStore.setGameData(response);

      return true;
    } catch (error: any) {
      showAlert({
        message: error?.message ?? t("warnings.gameData.errorOnRetrieve"),
        statusCode: error?.status ?? 400,
      });

      return false;
    }
  };

  return {
    retrieveGameData,
  };
}
