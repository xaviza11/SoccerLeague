interface CreatePlayerResponse {
  id: string;
  name: string;
  country: string;

  team: {
    id: string;
  };

  position: string;
  current_position: string;
  original_position: string;

  isBench: string;

  number: number;
  height_cm: number;
  max_skill_level: number;

  card: string | null;

  status: PlayerStatus;
  skills: PlayerSkills;
  instructions: PlayerInstructions;
  stats: PlayerStats;
}

interface PlayerStatus {
  age: number;
  is_active: boolean;
  injured_until: string;
  retirement_age: number;
}

interface PlayerSkills {
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

interface PlayerInstructions {
  offensive: string[];
  defensive: string[];
}

interface PlayerStats {
  goals: number;
  total_shots: number;
  total_passes: number;
  faults: number;
  assists: number;
  red_cards: number;
  yellow_cards: number;
  total_games: number;
}

interface FindOnePlayerResponse {
  id: string;
  name: string;
  country: string;

  team: {
    id: string;
  };

  position: string;
  current_position: string;
  original_position: string;

  isBench: string;

  number: number;
  height_cm: number;
  max_skill_level: number;

  card: string | null;

  status: PlayerStatus;
  skills: PlayerSkills;
  instructions: PlayerInstructions;
  stats: PlayerStats;
}

interface UpdateIsBenchResponse {
  
}

export type { CreatePlayerResponse, FindOnePlayerResponse, UpdateIsBenchResponse };
