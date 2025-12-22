interface CreateTeamResponse {
    id: string;
    players: Array<any>;
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

export type { CreateTeamResponse, UpdateTeamResponse };