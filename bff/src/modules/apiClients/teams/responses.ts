import type { Player } from "../../models/interfaces/index.js";

interface CreateTeamResponse {
  id: string;
  players: Array<Player>;
  storage: {
    id: string;
  };
}

interface UpdateTeamResponse {
  id: string;
  name: string;
  players: { id: string; name?: string }[];
  bench_players: { id: string; name?: string }[];
  auras: string[];
  storage: { id: string };
}

interface GetTeamResponse {
  id: string;
  name: string;
  players: [];
  storage: { id: string };
  bench_players: [];
  auras: [];
}

export type { CreateTeamResponse, UpdateTeamResponse, GetTeamResponse };
