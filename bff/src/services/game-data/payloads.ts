import type Player from "../../modules/models/interfaces/player.js";

interface UpdateTeamServicePayload {
  token: string;
  players: Player[];
}

interface RetrieveOpponentTeamPayload {
  token: string,
  id: string
}

interface RetrieveUserGamePayload {
  token: string
}

export type { UpdateTeamServicePayload, RetrieveOpponentTeamPayload, RetrieveUserGamePayload }
