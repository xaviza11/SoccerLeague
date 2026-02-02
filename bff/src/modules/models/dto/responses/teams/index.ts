interface CreateTeamResponse {
  id: string;
  players: Array<any>; //TODO: UPDATE DTO
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
