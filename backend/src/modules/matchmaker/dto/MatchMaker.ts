interface Match {
    playerOneId: string,
    playerTwoId: string | null,
    isAiGame: boolean,
    playerOneElo: number,
    playerTwoElo: number | null 
}

interface User {
    stats: {
        elo: number
    },
    id: string,
    has_game: boolean
}

export type { Match, User }