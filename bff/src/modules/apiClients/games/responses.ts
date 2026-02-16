interface CreateGameResponse {
  player1: string;
  player2: string;
  is_ai_game: boolean;
}

interface RetrieveUserGameResponse {
  id: string,
  playerOneId: string,
  playerTwoId: string,
  isAiGame: boolean,
  playerOneElo: number,
  playerTwoElo: number,
}

export type { CreateGameResponse, RetrieveUserGameResponse }