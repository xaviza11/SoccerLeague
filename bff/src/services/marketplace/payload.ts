import { Positions } from "../../modules/models/enums/index.js"

interface BuyPlayerPayload {
    token: string,
    target_avr: number,
    position: Positions,
    teamId: string
}

export type { BuyPlayerPayload }