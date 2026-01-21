interface RetrieveGameDataResponse {
  position_change_cards: any[];
  cards: any[];
  team: {
    id: string;
    name: string;
    players: any[];
    storage: {
      id: string;
    };
    auras: any[];
  };
}

export const handlerRetrieveGameData = async (): Promise<RetrieveGameDataResponse> => {
  return await $fetch<RetrieveGameDataResponse>("/api/gameData/retrieve", {
    method: "GET",
  });
};
