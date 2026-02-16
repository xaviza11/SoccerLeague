interface RetrieveLeaderBoardPayload {
  page: number;
  limit: number;
}

interface GetUserRankingPayload {
  userId: string
}

export type { RetrieveLeaderBoardPayload, GetUserRankingPayload }