use rand::Rng;
use crate::models::game::Game;
use crate::models::player::Player;

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum CrossOutcome {
    Success,    // cross reached a teammate cleanly
    Intercept,  // defender intercepted the ball
    Rebound,    // cross went wrong, loose ball
}

/// Resolves a cross attempt, considering the player's crossing skill.
/// RNG is injected for deterministic testing.
pub fn solve_cross<R: Rng>(
    team_index: usize,
    player: &mut Player,
    game: &mut Game,
    rng: &mut R,
) -> CrossOutcome {
    // Player skill for crossing (we could weight speed/control if needed)
    let cross_skill = player.skills.crossing as f32;

    // Determine defensive pressure: average defense of opponent field players
    let opponent_index = if team_index == 0 { 1 } else { 0 };
    let defenders: Vec<&Player> = game.teams[opponent_index]
        .players
        .iter()
        .filter(|p| p.position != "Goalkeeper")
        .collect();

    let defense_strength = if !defenders.is_empty() {
        defenders.iter().map(|p| p.skills.defense as f32).sum::<f32>() / defenders.len() as f32
    } else {
        50.0
    };

    // Base probabilities
    let prob_success = (cross_skill / (cross_skill + defense_strength)).clamp(0.1, 0.9);
    let prob_rebound = 0.1; // small chance of miscontrol
    let roll: f32 = rng.gen_range(0.0..1.0);

    if roll < prob_success {
        CrossOutcome::Success
    } else if roll < prob_success + prob_rebound {
        CrossOutcome::Rebound
    } else {
        CrossOutcome::Intercept
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};
    use crate::models::game::{Game, Team};
    use rand::SeedableRng;
    use std::collections::HashSet;

    fn make_player(name: &str, position: &str, crossing: u8, defense: u8) -> Player {
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
                crossing,
                defense,
                shooting: 50,
                passing: 50,
                dribbling: 50,
                physical: 50,
                speed: 50,
                stamina: 50,
                vision: 50,
                aggression: 50,
                composure: 50,
                control: 50,
                intuition: 50,
                handling: 50,
                kicking: 50,
                reflexes: 50,
                finishing: 50,
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
    fn cross_should_produce_all_possible_outcomes() {
        let crosser = make_player("Crosser", "Midfielder", 80, 40);
        let defender = make_player("Defender", "Defender", 20, 90);
        let mut game = make_game(crosser.clone(), defender.clone());
        let mut crosser_clone = crosser.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(12345);
        let mut results = HashSet::new();

        for _ in 0..200 {
            let outcome = solve_cross(0, &mut crosser_clone, &mut game, &mut rng);
            results.insert(outcome);
        }

        assert!(results.contains(&CrossOutcome::Success), "Expected at least one Success");
        assert!(results.contains(&CrossOutcome::Intercept), "Expected at least one Intercept");
        assert!(results.contains(&CrossOutcome::Rebound), "Expected at least one Rebound");
    }

    #[test]
    fn cross_should_succeed_more_against_weak_defense() {
        let crosser = make_player("Crosser", "Midfielder", 90, 30);
        let weak_defender = make_player("WeakDef", "Defender", 20, 20);
        let mut game = make_game(crosser.clone(), weak_defender.clone());
        let mut crosser_clone = crosser.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(42);
        let mut success_count = 0;

        for _ in 0..100 {
            let outcome = solve_cross(0, &mut crosser_clone, &mut game, &mut rng);
            if outcome == CrossOutcome::Success {
                success_count += 1;
            }
        }

        assert!(success_count > 50, "Expected most crosses to succeed against weak defense, got {success_count}");
    }

    #[test]
    fn cross_should_fail_more_against_strong_defense() {
        let crosser = make_player("Crosser", "Midfielder", 50, 30);
        let strong_defender = make_player("StrongDef", "Defender", 20, 95);
        let mut game = make_game(crosser.clone(), strong_defender.clone());
        let mut crosser_clone = crosser.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(99);
        let mut intercept_count = 0;

        for _ in 0..100 {
            let outcome = solve_cross(0, &mut crosser_clone, &mut game, &mut rng);
            if outcome == CrossOutcome::Intercept {
                intercept_count += 1;
            }
        }

        assert!(intercept_count > 30, "Expected many crosses to be intercepted by strong defense, got {intercept_count}");
    }
}
