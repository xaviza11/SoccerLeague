interface CreateUsersStorageResponse {
  id: string;
}

interface FindOneUsersStorageResponse {
  id: string;
  team: { id: string; name: string };
  position_change_cards: [];
  cards: [];
}

export type { CreateUsersStorageResponse, FindOneUsersStorageResponse };
