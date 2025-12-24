interface UpdateTeamPayload {
  name?: string;
  players?: string[];       
  bench_players?: string[];  
  auras?: string[];
}

interface DeleteTeamPayload {
  teamId: string;
}

export type { UpdateTeamPayload, DeleteTeamPayload };