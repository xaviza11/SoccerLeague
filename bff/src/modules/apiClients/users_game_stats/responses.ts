interface CreateUsersGameStatsResponse {
  id: string;
  elo: number;
  money: number;
  total_games: number;
}

interface LeaderBoardItem {
  id: string,
  elo: number,
  money: number,
  total_games: number,
  user: {
    id: string,
    name: string
  }
}

interface GetUserRankingResponse {
  userRank: number
}

type GetLeaderBoardResponse = LeaderBoardItem[]

export type { CreateUsersGameStatsResponse, GetLeaderBoardResponse, GetUserRankingResponse };
