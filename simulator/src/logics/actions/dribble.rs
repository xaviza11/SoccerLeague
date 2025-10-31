use rand::Rng;
use rand::rngs::StdRng;
use rand::SeedableRng;
use crate::models::game::Game;
use crate::models::player::Player;

#[derive(Debug, PartialEq, Eq)]
pub enum DribbleOutcome {
    Success,
    Fault,
    YellowCard,
    RedCard,
    Rebound,
    Fail,
}

/// Attempts a dribble and returns a probabilistic outcome.
/// Accepts an RNG to make outcomes deterministic for testing.
pub fn solve_dribble<R: Rng>(
    team_index: usize,
    position: &str,
    game: &mut Game,
    player: &mut Player,
    rng: &mut R,
) -> DribbleOutcome {
    let opponent_index = if team_index == 0 { 1 } else { 0 };
    let dribble_skill = player.skills.dribbling as f32;

    let defenders: Vec<&Player> = game.teams[opponent_index]
        .players
        .iter()
        .filter(|p| p.position == position)
        .collect();

    let defense_skill = if !defenders.is_empty() {
        defenders.iter().map(|p| p.skills.defense as f32).sum::<f32>() / defenders.len() as f32
    } else {
        50.0
    };

    let defense_multiplier = match defenders.len() {
        0 | 1 => 1.0,
        2 => 1.15,
        _ => 1.25,
    };
    let adjusted_defense = defense_skill * defense_multiplier;

    let mut dribble_chance = dribble_skill / (dribble_skill + adjusted_defense);
    dribble_chance = dribble_chance.clamp(0.0, 1.0);

    let roll: f32 = rng.gen_range(0.0..1.0);

    // 1) Success
    if roll < dribble_chance {
        return DribbleOutcome::Success;
    }

    // 2) Rebound
    let pressure = ((adjusted_defense - dribble_skill) / (adjusted_defense + dribble_skill + 1.0))
        .max(0.0)
        .min(0.95);
    if rng.gen_range(0.0..1.0) < pressure {
        return DribbleOutcome::Rebound;
    }

    // 3) Foul
    let base_foul = 0.03 + 0.02 * (defenders.len() as f32).min(3.0);
    if rng.gen_range(0.0..1.0) < base_foul {
        let card_roll = rng.gen_range(0.0..1.0);
        if card_roll < 0.02 {
            return DribbleOutcome::RedCard;
        } else if card_roll < 0.20 {
            return DribbleOutcome::YellowCard;
        } else {
            return DribbleOutcome::Fault;
        }
    }

    // 4) Fail
    DribbleOutcome::Fail
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};
    use crate::models::game::{Game, Team};

    fn make_player(name: &str, position: &str, dribbling: u8, defense: u8) -> Player {
        Player {
            name: name.to_string(),
            country: "Testland".to_string(),
            position: position.to_string(),
            current_position: position.to_string(),
            original_position: position.to_string(),
            age: 25,
            is_active: true,
            injured_until: "".to_string(),
            max_skill_level: 90,
            retirement_age: 35,
            card: "None".to_string(),
            offensive_instructions: vec![],
            defensive_instructions: vec![],
            height_cm: 180,
            skills: Skills {
                shooting: 50,
                passing: 50,
                dribbling,
                defense,
                physical: 50,
                speed: 50,
                stamina: 50,
                vision: 50,
                crossing: 50,
                finishing: 50,
                aggression: 50,
                composure: 50,
                control: 50,
                intuition: 50,
                handling: 50,
                kicking: 50,
                reflexes: 50,
            },
        }
    }

    fn make_game(player_a: Player, player_b: Player) -> Game {
        let team_a = Team {
            name: "Team A".to_string(),
            players: vec![player_a],
            bench_players: vec![],
            aura: vec![],
            substitutions: vec![],
        };
        let team_b = Team {
            name: "Team B".to_string(),
            players: vec![player_b],
            bench_players: vec![],
            aura: vec![],
            substitutions: vec![],
        };
        Game { teams: [team_a, team_b] }
    }

    #[test]
    fn deterministic_success_test() {
        let player_a = make_player("Dribbler", "Forward", 90, 0);
        let player_b = make_player("Defender", "Forward", 0, 30);
        let mut game = make_game(player_a.clone(), player_b.clone());
        let mut dribbler = player_a.clone();

        let mut rng = StdRng::seed_from_u64(1234);
        let outcome = solve_dribble(0, "Forward", &mut game, &mut dribbler, &mut rng);
        assert_eq!(outcome, DribbleOutcome::Success);
    }

    #[test]
    fn deterministic_fail_test() {
        let player_a = make_player("Dribbler", "Forward", 40, 0);
        let player_b = make_player("Wall", "Forward", 0, 95);
        let mut game = make_game(player_a.clone(), player_b.clone());
        let mut dribbler = player_a.clone();

        let mut rng = StdRng::seed_from_u64(5678);
        let outcome = solve_dribble(0, "Forward", &mut game, &mut dribbler, &mut rng);
        // With this seed, dribble fails
        assert!(matches!(outcome, DribbleOutcome::Fail | DribbleOutcome::Rebound));
    }
}
