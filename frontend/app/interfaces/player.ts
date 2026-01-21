export default interface Player {
  id: string;
  name: string;
  country: string;
  position: string;
  current_position: string;
  original_position: string;
  max_skill_level: number;
  isBench: boolean;
  height_cm: number;
  number: number;
  skills: Record<string, number>;
  status: {
    age: number;
    is_active: boolean;
    injured_until: string;
    retirement_age: number;
  };
  instructions: {
    offensive: any[];
    defensive: any[];
  };
  stats: {
    goals: number;
    total_shots: number;
    total_passes: number;
    faults: number;
    assists: number;
    red_cards: number;
    yellow_cards: number;
    total_games: number;
  };
}