interface addCardUsersStoragePayload {
  id: string;
  cardId: string;
}

interface addPositionCardStoragePayload {
    id: string;
    positionChangeCardId: string;
}

interface addTeamStoragePayload {
    id: string;
    teamId: string;
}

interface DeleteUsersStoragePayload {
    storageId: string;
}

export type { addCardUsersStoragePayload, addPositionCardStoragePayload, addTeamStoragePayload, DeleteUsersStoragePayload };
