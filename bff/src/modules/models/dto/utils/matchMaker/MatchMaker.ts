interface Match {
    playerOneId: string,
    playerTwoId: string | null,
    is_ai_game: boolean,
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