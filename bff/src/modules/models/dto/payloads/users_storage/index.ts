interface addCardUsersStoragePayload {
  id: string;
  cardId: string;
}

interface addPositionCardStoragePayload {
  id: string;
  positionChangeCardId: string;
}

interface FindOneUsersStoragePayload {
  storageId: string;
}

interface AddTeamStoragePayload {
  id: string;
  teamId: string;
}

interface DeleteUsersStoragePayload {
  storageId: string;
}

export type {
  addCardUsersStoragePayload,
  addPositionCardStoragePayload,
  AddTeamStoragePayload,
  DeleteUsersStoragePayload,
  FindOneUsersStoragePayload,
};
