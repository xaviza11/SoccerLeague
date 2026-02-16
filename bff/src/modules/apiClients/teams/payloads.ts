import { Positions } from "../../models/enums/index.js";
import type Player from "../../models/interfaces/player.js";

interface UpdateTeamPayload {
  name?: string;
  players?: string[];
  auras?: string[];
}

interface GetTeamPayload {
  teamId: string;
}

interface DeleteTeamPayload {
  teamId: string;
}

interface UpdateLineupPlayer {
  id: string;
  isBench: boolean;
}

interface UpdateLineupPayload {
  teamId: string;
  players: UpdateLineupPlayer[];
}

interface BuyPlayerPayload {
  player: Player,
  token: string,
  teamId: string
}

export type { UpdateTeamPayload, DeleteTeamPayload, GetTeamPayload, UpdateLineupPlayer, UpdateLineupPayload, BuyPlayerPayload };
