use rand::Rng;
use crate::models::game::Game;
use crate::models::player::Player;

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum ShootOutcome {
    Goal,
    Saved,
    Corner,
    Rebound,
}

/// Resolves a shot attempt considering player shooting/finishing skills
/// and goalkeeper skills (handling, intuition, reflexes).
/// RNG is injected for deterministic testing.
pub fn solve_shoot<R: Rng>(
    team_index: usize,
    _position: &str,
    game: &mut Game,
    player: &mut Player,
    rng: &mut R,
) -> ShootOutcome {
    let opponent_index = if team_index == 0 { 1 } else { 0 };

    // Compute shooter skill
    let shoot_skill = (player.skills.shooting as f32 * 0.6
        + player.skills.finishing as f32 * 0.4)
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

    // Compute base probabilities
    let prob_goal = (shoot_skill / (shoot_skill + gk_skill)).clamp(0.01, 0.99);

    // If not goal, determine corner/rebound/saved
    let prob_corner = (shoot_skill / 200.0).clamp(0.05, 0.3);
    let prob_rebound = 0.15;

    // Roll a single random number for deterministic weighted outcome
    let roll: f32 = rng.gen_range(0.0..1.0);

    if roll < prob_goal {
        ShootOutcome::Goal
    } else if roll < prob_goal + prob_corner {
        ShootOutcome::Corner
    } else if roll < prob_goal + prob_corner + prob_rebound {
        ShootOutcome::Rebound
    } else {
        ShootOutcome::Saved
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
                composure: 50,
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
    fn shoot_should_produce_all_possible_outcomes() {
        let shooter = make_player("Shooter", "Forward", 70, 70, 0, 80, 80, 80);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 80, 80, 80);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(42);
        let mut results = HashSet::new();

        for _ in 0..100 {
            let outcome = solve_shoot(0, "Forward", &mut game, &mut shooter_clone, &mut rng);
            results.insert(outcome);
        }

        // Ensure all outcomes exist at least once
        assert!(results.contains(&ShootOutcome::Goal), "Expected at least one Goal");
        assert!(results.contains(&ShootOutcome::Saved), "Expected at least one Saved");
        assert!(results.contains(&ShootOutcome::Corner), "Expected at least one Corner");
        assert!(results.contains(&ShootOutcome::Rebound), "Expected at least one Rebound");
    }

    #[test]
    fn strong_goalkeeper_blocks_most_goals() {
        let shooter = make_player("Shooter", "Forward", 60, 60, 0, 20, 20, 20);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 95, 95, 95);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(123);
        let mut goal_count = 0;

        for _ in 0..100 {
            let outcome = solve_shoot(0, "Forward", &mut game, &mut shooter_clone, &mut rng);
            if outcome == ShootOutcome::Goal {
                goal_count += 1;
            }
        }

        assert!(goal_count < 50, "Strong GK should block most goals, got {goal_count}");
    }

    #[test]
    fn weak_goalkeeper_allows_many_goals() {
        let shooter = make_player("Shooter", "Forward", 90, 90, 0, 10, 10, 10);
        let goalkeeper = make_player("Goalie", "Goalkeeper", 0, 0, 0, 10, 10, 10);
        let mut game = make_game(shooter.clone(), goalkeeper.clone());
        let mut shooter_clone = shooter.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(456);
        let mut goal_count = 0;

        for _ in 0..100 {
            let outcome = solve_shoot(0, "Forward", &mut game, &mut shooter_clone, &mut rng);
            if outcome == ShootOutcome::Goal {
                goal_count += 1;
            }
        }

        assert!(goal_count > 50, "Weak GK should concede many goals, got {goal_count}");
    }
}

