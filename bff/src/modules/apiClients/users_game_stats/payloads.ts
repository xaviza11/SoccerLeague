interface DeleteUsersGameStatsPayload {
  statsId: string;
}


interface RetrieveLeaderBoardPayload {
  page: number,
  limit: number
}

interface GetUserRankingPayload {
  userId: string
}

export type { DeleteUsersGameStatsPayload, RetrieveLeaderBoardPayload, GetUserRankingPayload };
