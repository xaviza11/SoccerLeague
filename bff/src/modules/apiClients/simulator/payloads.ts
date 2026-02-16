import { Positions, Auras } from "../../models/enums/index.js";

interface Substitutions {
  minute: number;
  player_out: number;
  player_in: number;
}

interface Team {
  name: string;
  player_name: string;
  players: [];
  bench_players: [];
  aura: [Auras];
  substitutions: [Substitutions];
}

interface GeneratePlayerPayload {
  position: Positions;
  target_avr: number;
}

interface SimulateMatchPayload {
  teams: [Team];
}

export type { GeneratePlayerPayload, SimulateMatchPayload };
