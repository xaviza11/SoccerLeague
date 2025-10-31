use rand::Rng;
use crate::models::game::Game;
use crate::models::player::Player;

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
pub enum PenaltyOutcome {
    Goal,
    Saved,
    Rebound,
}

/// Resolves a penalty attempt, considering player shooting/finishing/composure
/// and goalkeeper skills (handling, intuition, reflexes).
/// RNG is injected for deterministic testing.
pub fn solve_penalty<R: Rng>(
    team_index: usize,
    _position: &str,
    game: &mut Game,
    player: &mut Player,
    rng: &mut R,
) -> PenaltyOutcome {
    let opponent_index = if team_index == 0 { 1 } else { 0 };

    // Compute player skill: weighted sum
    let player_skill = (player.skills.shooting as f32 * 0.5
        + player.skills.finishing as f32 * 0.3
        + player.skills.composure as f32 * 0.2)
        .clamp(1.0, 99.0);

    // Find the goalkeeper
    let goalkeeper = game.teams[opponent_index]
        .players
        .iter()
        .find(|p| p.position == "Goalkeeper");

    // Compute goalkeeper skill
    let gk_skill = if let Some(gk) = goalkeeper {
        (gk.skills.handling as f32 * 0.4
            + gk.skills.intuition as f32 * 0.3
            + gk.skills.reflexes as f32 * 0.3)
            .clamp(1.0, 99.0)
    } else {
        0.0
    };

    // Base probabilities
    let prob_goal = (player_skill / (player_skill + gk_skill) * 1.2).clamp(0.2, 0.99);
    let prob_rebound = 0.05; // small chance for rebound

    // Single roll for deterministic weighted outcome
    let roll: f32 = rng.gen_range(0.0..1.0);

    if roll < prob_goal {
        PenaltyOutcome::Goal
    } else if roll < prob_goal + prob_rebound {
        PenaltyOutcome::Rebound
    } else {
        PenaltyOutcome::Saved
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};
    use crate::models::game::{Game, Team};
    use std::collections::HashSet;
    use rand::SeedableRng;

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
                composure,
                passing: 50,
                dribbling: 50,
                defense,
                physical: 50,
                speed: 50,
                stamina: 50,
                vision: 50,
                crossing: 50,
                aggression: 50,
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
    fn penalty_should_score_with_weak_goalkeeper() {
        let shooter = make_player("Shooter", "Forward", 90, 90, 90, 0, 20, 20, 20);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 0, 20, 20, 20);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(1234);
        let mut results = HashSet::new();
        for _ in 0..100 {
            let outcome = solve_penalty(0, "Forward", &mut game, &mut shooter_clone, &mut rng);
            results.insert(outcome);
        }

        assert!(results.contains(&PenaltyOutcome::Goal), "Expected at least one Goal");
    }

    #[test]
    fn penalty_can_be_saved_by_strong_goalkeeper() {
        let shooter = make_player("Shooter", "Forward", 70, 70, 70, 0, 95, 95, 95);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 0, 95, 95, 95);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(42);
        let mut results = HashSet::new();
        for _ in 0..100 {
            let outcome = solve_penalty(0, "Forward", &mut game, &mut shooter_clone, &mut rng);
            results.insert(outcome);
        }

        assert!(results.contains(&PenaltyOutcome::Goal), "Expected at least one Goal");
        assert!(results.contains(&PenaltyOutcome::Saved), "Expected at least one Saved");
    }

    #[test]
    fn penalty_can_result_in_rebound() {
        let shooter = make_player("Shooter", "Forward", 50, 50, 50, 0, 80, 80, 80);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 0, 80, 80, 80);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(777);
        let mut results = HashSet::new();
        for _ in 0..200 {
            let outcome = solve_penalty(0, "Forward", &mut game, &mut shooter_clone, &mut rng);
            results.insert(outcome);
        }

        assert!(results.contains(&PenaltyOutcome::Goal), "Expected at least one Goal");
        assert!(results.contains(&PenaltyOutcome::Saved), "Expected at least one Saved");
        assert!(results.contains(&PenaltyOutcome::Rebound), "Expected at least one Rebound");
    }
}
