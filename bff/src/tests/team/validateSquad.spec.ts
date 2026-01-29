import { describe, it, expect } from "vitest"
import { validateSquad } from "../../modules/common/validators/team/index.js"
import type Player from "../../modules/models/interfaces/player.js"

const makePlayer = (overrides: Partial<Player> = {}): Player => ({
  id: overrides.id ?? "1",
  name: overrides.name ?? "Player",
  country: overrides.country ?? "Neverland",
  position: overrides.position ?? "Goalkeeper",
  current_position: overrides.current_position ?? "Goalkeeper",
  original_position: overrides.original_position ?? "Goalkeeper",
  max_skill_level: overrides.max_skill_level ?? 50,
  isBench: overrides.isBench ?? false,
  height_cm: overrides.height_cm ?? 180,
  card: overrides.card ?? null,
  number: overrides.number ?? 0,
  skills: overrides.skills ?? {
    shooting: 0,
    passing: 0,
    dribbling: 0,
    defense: 0,
    physical: 0,
    speed: 0,
    stamina: 0,
    vision: 0,
    crossing: 0,
    finishing: 0,
    aggression: 0,
    composure: 0,
    control: 0,
    intuition: 0,
    handling: 0,
    kicking: 0,
    reflexes: 0,
  },
  status: overrides.status ?? {
    age: 20,
    is_active: true,
    injured_until: "",
    retirement_age: 35,
  },
  instructions: overrides.instructions ?? { offensive: [], defensive: [] },
  stats: overrides.stats ?? {
    goals: 0,
    total_shots: 0,
    total_passes: 0,
    faults: 0,
    assists: 0,
    red_cards: 0,
    yellow_cards: 0,
    total_games: 0,
  },
  ...overrides,
})

export default makePlayer


describe("validateSquad", () => {
  it("should validate a correct 11-player team", () => {
    const squad: Player[] = [
      makePlayer({ position: "Goalkeeper" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Left_Back" }),
      makePlayer({ position: "Right_Back" }),
      makePlayer({ position: "Midfielder" }),
      makePlayer({ position: "Left_Midfield" }),
      makePlayer({ position: "Right_Midfield" }),
      makePlayer({ position: "Attacking_Midfield" }),
      makePlayer({ position: "Striker" }),
    ]

    const result = validateSquad(squad)
    expect(result.isValid).toBe(true)
    expect(result.message).toBe("")
  })

  it("should fail if total starters != 11", () => {
    const squad: Player[] = [
      makePlayer({ position: "Goalkeeper" }),
      makePlayer({ position: "Defender" })
    ]
    const result = validateSquad(squad)
    expect(result.isValid).toBe(false)
    expect(result.message).toBe("The main team must have exactly 11 players")
  })

  it("should fail if no main goalkeeper", () => {
    const squad: Player[] = Array(11).fill(makePlayer({ position: "Defender" }))
    const result = validateSquad(squad)
    expect(result.isValid).toBe(false)
    expect(result.message).toBe("Exactly one goalkeeper is required")
  })

  it("should fail if defenders out of range", () => {
    const squad: Player[] = [
      makePlayer({ position: "Goalkeeper" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Midfielder" }),
      makePlayer({ position: "Midfielder" }),
      makePlayer({ position: "Midfielder" }),
      makePlayer({ position: "Attacking_Midfield" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Right_Wing" }),
      makePlayer({ position: "Left_Wing" }),
    ]
    const result = validateSquad(squad)
    expect(result.isValid).toBe(false)
    expect(result.message).toBe("Team must have between 3 and 5 defenders")
  })

  it("should fail if midfielders out of range", () => {
    const squad: Player[] = [
      makePlayer({ position: "Goalkeeper" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Right_Wing" }),
      makePlayer({ position: "Left_Wing" }),
      makePlayer({ position: "Left_Back" }),
      makePlayer({ position: "Right_Back" }),
    ]
    const result = validateSquad(squad)
    expect(result.isValid).toBe(false)
    expect(result.message).include("Team must have between")
  })

  it("should fail if attackers out of range", () => {
    const squad: Player[] = [
      makePlayer({ position: "Goalkeeper" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Defender" }),
      makePlayer({ position: "Midfielder" }),
      makePlayer({ position: "Midfielder" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Striker" }),
      makePlayer({ position: "Striker" }),
    ]
    const result = validateSquad(squad)
    expect(result.isValid).toBe(false)
    expect(result.message).include("Team must have")
  })
})
