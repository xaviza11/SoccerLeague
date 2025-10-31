use rand::Rng;
use crate::models::game::Game;
use crate::models::player::Player;

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
pub enum LongPassOutcome {
    Success,
    Intercept,
    Rebound,
}

/// Resolves a long pass attempt.
/// Success depends on the player's passing skill versus opponent defense.
/// RNG is injected for deterministic testing.
pub fn solve_long_pass<R: Rng>(
    team_index: usize,
    player: &mut Player,
    game: &mut Game,
    rng: &mut R,
) -> LongPassOutcome {
    let opponent_index = if team_index == 0 { 1 } else { 0 };

    let pass_skill = player.skills.passing as f32;

    // Compute average defense of opposing team
    let avg_defense = if !game.teams[opponent_index].players.is_empty() {
        game.teams[opponent_index]
            .players
            .iter()
            .map(|p| p.skills.defense as f32)
            .sum::<f32>()
            / game.teams[opponent_index].players.len() as f32
    } else {
        50.0
    };

    // Success probability
    let prob_success = (pass_skill / (pass_skill + avg_defense)).clamp(0.05, 0.95);

    // Probabilities for intercept and rebound
    let prob_intercept = ((avg_defense - pass_skill) / 200.0).clamp(0.05, 0.5);
    let prob_rebound = 0.1; // fixed 10%

    // Roll a single random number to determine outcome
    let roll: f32 = rng.gen_range(0.0..1.0);

    if roll < prob_success {
        LongPassOutcome::Success
    } else if roll < prob_success + prob_intercept {
        LongPassOutcome::Intercept
    } else if roll < prob_success + prob_intercept + prob_rebound {
        LongPassOutcome::Rebound
    } else {
        LongPassOutcome::Intercept // default to intercept if none triggered
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};
    use crate::models::game::{Game, Team};
    use rand::SeedableRng;

    fn make_player(name: &str, passing: u8, defense: u8) -> Player {
        Player {
            name: name.to_string(),
            country: "Testland".to_string(),
            position: "Midfielder".to_string(),
            current_position: "Midfielder".to_string(),
            original_position: "Midfielder".to_string(),
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
                passing,
                dribbling: 50,
                shooting: 50,
                finishing: 50,
                defense,
                physical: 50,
                speed: 50,
                stamina: 50,
                vision: 50,
                crossing: 50,
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
    fn long_pass_should_succeed_with_high_passing() {
        let passer = make_player("Passer", 90, 30);
        let defender = make_player("Defender", 50, 90);
        let mut game = make_game(passer.clone(), defender.clone());
        let mut passer_clone = passer.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(1234);

        let mut results = vec![];
        for _ in 0..100 {
            let outcome = solve_long_pass(0, &mut passer_clone, &mut game, &mut rng);
            results.push(outcome);
        }

        assert!(results.contains(&LongPassOutcome::Success), "Expected at least one Success");
    }

    #[test]
    fn long_pass_can_be_intercepted() {
        let passer = make_player("Passer", 40, 30);
        let defender = make_player("Defender", 50, 90);
        let mut game = make_game(passer.clone(), defender.clone());
        let mut passer_clone = passer.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(42);

        let mut results = vec![];
        for _ in 0..100 {
            let outcome = solve_long_pass(0, &mut passer_clone, &mut game, &mut rng);
            results.push(outcome);
        }

        assert!(results.contains(&LongPassOutcome::Intercept), "Expected at least one Intercept");
    }

    #[test]
    fn long_pass_can_result_in_rebound() {
        let passer = make_player("Passer", 50, 50);
        let defender = make_player("Defender", 50, 90);
        let mut game = make_game(passer.clone(), defender.clone());
        let mut passer_clone = passer.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(777);

        let mut results = vec![];
        for _ in 0..100 {
            let outcome = solve_long_pass(0, &mut passer_clone, &mut game, &mut rng);
            results.push(outcome);
        }

        assert!(results.contains(&LongPassOutcome::Rebound), "Expected at least one Rebound");
    }

    #[test]
    fn long_pass_can_produce_all_outcomes() {
        let passer = make_player("Passer", 60, 50);
        let defender = make_player("Defender", 50, 80);
        let mut game = make_game(passer.clone(), defender.clone());
        let mut passer_clone = passer.clone();

        let mut rng = rand::rngs::StdRng::seed_from_u64(999);

        let mut results = vec![];
        for _ in 0..500 {
            let outcome = solve_long_pass(0, &mut passer_clone, &mut game, &mut rng);
            results.push(outcome);
        }

        assert!(results.contains(&LongPassOutcome::Success), "Expected at least one Success");
        assert!(results.contains(&LongPassOutcome::Intercept), "Expected at least one Intercept");
        assert!(results.contains(&LongPassOutcome::Rebound), "Expected at least one Rebound");
    }
}
