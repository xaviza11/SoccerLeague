use rand::Rng;
use crate::models::game::Game;
use crate::models::player::Player;

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum FreeKickOutcome {
    Goal,
    Saved,
    Corner,
    Rebound,
}

/// Resolves a free kick attempt, considering player shooting/finishing/composure
/// and goalkeeper skills (handling, intuition, reflexes).
/// RNG is injected for deterministic testing.
pub fn solve_free_kick<R: Rng>(
    team_index: usize,
    _position: &str,
    game: &mut Game,
    player: &mut Player,
    rng: &mut R,
) -> FreeKickOutcome {
    let opponent_index = if team_index == 0 { 1 } else { 0 };

    // Player skill: weighted combination of shooting, finishing, and composure
    let player_skill = (player.skills.shooting as f32 * 0.5
        + player.skills.finishing as f32 * 0.3
        + player.skills.composure as f32 * 0.2)
        .clamp(1.0, 99.0);

    // Find the goalkeeper
    let goalkeeper = game.teams[opponent_index]
        .players
        .iter()
        .find(|p| p.position == "Goalkeeper");

    // Goalkeeper skill
    let gk_skill = if let Some(gk) = goalkeeper {
        (gk.skills.handling as f32 * 0.4
            + gk.skills.intuition as f32 * 0.3
            + gk.skills.reflexes as f32 * 0.3)
            .clamp(1.0, 99.0)
    } else {
        0.0
    };

    // Probabilities
    let prob_goal = (player_skill / (player_skill + gk_skill)).clamp(0.01, 0.99);
    let prob_corner = (player_skill / 250.0).clamp(0.05, 0.25); // corners slightly less likely
    let prob_rebound = 0.15;

    // Roll a single random number for deterministic weighted outcome
    let roll: f32 = rng.gen_range(0.0..1.0);

    if roll < prob_goal {
        FreeKickOutcome::Goal
    } else if roll < prob_goal + prob_corner {
        FreeKickOutcome::Corner
    } else if roll < prob_goal + prob_corner + prob_rebound {
        FreeKickOutcome::Rebound
    } else {
        FreeKickOutcome::Saved
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};
    use crate::models::game::{Game, Team};
    use rand::SeedableRng;
    use std::collections::HashSet;

    fn make_player(
        name: &str,
        position: &str,
        shooting: u8,
        finishing: u8,
        composure: u8,
        defense: u8,
        handling: u8,
        intuition: u8,
        reflexes: u8,
    ) -> Player {
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
                shooting,
                finishing,
                passing: 50,
                dribbling: 50,
                defense,
                physical: 50,
                speed: 50,
                stamina: 50,
                vision: 50,
                crossing: 50,
                aggression: 50,
                composure,
                control: 50,
                intuition,
                handling,
                kicking: 50,
                reflexes,
            },
        }
    }

    fn make_game(shooter: Player, goalkeeper: Player) -> Game {
        let team_a = Team {
            name: "Team A".to_string(),
            players: vec![shooter],
            bench_players: vec![],
            aura: vec![],
            substitutions: vec![],
        };
        let team_b = Team {
            name: "Team B".to_string(),
            players: vec![goalkeeper],
            bench_players: vec![],
            aura: vec![],
            substitutions: vec![],
        };
        Game { teams: [team_a, team_b] }
    }

    #[test]
    fn free_kick_should_score_with_weak_goalkeeper() {
        let shooter = make_player("Shooter", "Forward", 90, 90, 90, 0, 20, 20, 20);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 0, 20, 20, 20);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(1234);
        let mut outcomes = Vec::new();
        for _ in 0..100 {
            outcomes.push(solve_free_kick(0, "Forward", &mut game, &mut shooter_clone, &mut rng));
        }

        // Expect at least one goal
        assert!(outcomes.contains(&FreeKickOutcome::Goal));
    }

    #[test]
    fn free_kick_should_be_saved_by_strong_goalkeeper() {
        let shooter = make_player("Shooter", "Forward", 70, 70, 70, 0, 95, 95, 95);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 0, 95, 95, 95);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(42);
        let mut results = HashSet::new();
        for _ in 0..100 {
            let outcome = solve_free_kick(0, "Forward", &mut game, &mut shooter_clone, &mut rng);
            results.insert(outcome);
        }

        assert!(results.contains(&FreeKickOutcome::Saved));
        assert!(results.contains(&FreeKickOutcome::Corner));
        assert!(results.contains(&FreeKickOutcome::Rebound));
    }

    #[test]
    fn free_kick_should_include_all_outcomes() {
        let shooter = make_player("Shooter", "Forward", 75, 75, 75, 0, 80, 80, 80);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 0, 80, 80, 80);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(2025);
        let mut results = HashSet::new();
        for _ in 0..200 {
            let outcome = solve_free_kick(0, "Forward", &mut game, &mut shooter_clone, &mut rng);
            results.insert(outcome);
        }

        assert!(results.contains(&FreeKickOutcome::Goal), "Expected at least one Goal");
        assert!(results.contains(&FreeKickOutcome::Saved), "Expected at least one Saved");
        assert!(results.contains(&FreeKickOutcome::Corner), "Expected at least one Corner");
        assert!(results.contains(&FreeKickOutcome::Rebound), "Expected at least one Rebound");
    }
}
