interface UpdateTeamPayload {
  name?: string;
  players?: string[];       
  bench_players?: string[];  
  auras?: string[];
}

interface GetTeamPayload {
  teamId: string;
}

interface DeleteTeamPayload {
  teamId: string;
}

export type { UpdateTeamPayload, DeleteTeamPayload, GetTeamPayload };