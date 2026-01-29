import type { Player } from "../../../models/interfaces/index.js"

export default function validateSquad(players: Player[]): {isValid: boolean, message: string} {

  const goalKeepers = players.filter(p => p.position === "Goalkeeper")
  const defenders = players.filter(p => p.position === "Defender")
  const lbks = players.filter(p => p.position === "Left_Back")
  const rbks = players.filter(p => p.position === "Right_Back")
  const defMidfielders = players.filter(p => p.position === "Defensive_Midfield")
  const midfielders = players.filter(p => p.position === "Midfielder")
  const lmds = players.filter(p => p.position === "Left_Midfield")
  const rmds = players.filter(p => p.position === "Right_Midfield")
  const atmds = players.filter(p => p.position === "Attacking_Midfield")
  const lwgs = players.filter(p => p.position === "Left_Wing")
  const rwgs = players.filter(p => p.position === "Right_Wing")
  const strikers = players.filter(p => p.position === "Striker")

  const mainGoalKeeper = goalKeepers.filter(p => !p.isBench)
  const mainDefenders = defenders.filter(p => !p.isBench)
  const mainLbks = lbks.filter(p => !p.isBench)
  const mainRbks = rbks.filter(p => !p.isBench)
  const mainDefMidfielders = defMidfielders.filter(p => !p.isBench)
  const mainMidfielders = midfielders.filter(p => !p.isBench)
  const mainLmds = lmds.filter(p => !p.isBench)
  const mainRmds = rmds.filter(p => !p.isBench)
  const mainAtmds = atmds.filter(p => !p.isBench)
  const mainLwgs = lwgs.filter(p => !p.isBench)
  const mainRwgs = rwgs.filter(p => !p.isBench)
  const mainStrikers = strikers.filter(p => !p.isBench)

  const totalStarters =
    mainGoalKeeper.length +
    mainDefenders.length +
    mainLbks.length +
    mainRbks.length +
    mainDefMidfielders.length +
    mainMidfielders.length +
    mainLmds.length +
    mainRmds.length +
    mainAtmds.length +
    mainLwgs.length +
    mainRwgs.length +
    mainStrikers.length

  if (totalStarters !== 11) {
    return { isValid: false, message: `The main team must have exactly 11 players` }
  }

  if (mainGoalKeeper.length !== 1) {
    return { isValid: false, message: "Exactly one goalkeeper is required" }
  }

  const totalDefenders =
    mainDefenders.length +
    mainLbks.length +
    mainRbks.length

  if (totalDefenders < 3 || totalDefenders > 5) {
    return { isValid: false, message: "Team must have between 3 and 5 defenders" }
  }

  const totalMidfielders =
    mainMidfielders.length +
    mainLmds.length +
    mainRmds.length +
    mainAtmds.length

  if (totalMidfielders < 2 || totalMidfielders > 5) {
    return { isValid: false, message: "Team must have between 2 and 5 midfielders" }
  }

  const totalAttackers =
    mainStrikers.length +
    mainLwgs.length +
    mainRwgs.length

  if (totalAttackers < 1 || totalAttackers > 3) {
    return { isValid: false, message: "Team must have between 1 and 3 attackers" }
  }

  return { isValid: true, message: "" }
}