import type Player from "../../../interfaces/player.js";

interface UpdateTeamServicePayload {
  token: string;
  players: Player[];
}

export type { UpdateTeamServicePayload }
