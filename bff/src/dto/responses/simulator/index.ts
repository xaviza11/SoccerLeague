interface Skills {
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
  speed: number;
  stamina: number;
  vision: number;
  crossing: number;
  finishing: number;
  aggression: number;
  composure: number;
  control: number;
  intuition: number;
  handling: number;
  kicking: number;
  reflexes: number;
}

interface Status {
  age: number;
  is_active: boolean;
  injured_until: string | null;
  retirement_age: number;
}

interface Instructions {
  offensive: string[];
  defensive: string[];
}

interface Stats {
  goals: number;
  total_shots: number;
  total_passes: number;
  faults: number;
  assists: number;
  red_cards: number;
  yellow_cards: number;
  total_games: number;
}

interface GeneratePlayerResponse {
  name: string;
  country: string;
  position: string;
  current_position: string;
  original_position: string;
  max_skill_level: number;
  height_cm: number;
  card: string | null;
  number: number;
  skills: Skills;
  status: Status;
  instructions: Instructions;
  stats: Stats;
}

interface GenerateGameResponse {}

export type { GenerateGameResponse, GeneratePlayerResponse };
