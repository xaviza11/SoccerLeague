use rand::Rng;
use crate::models::player::Player;

#[derive(Debug, PartialEq, Eq)]
pub enum PassOutcome {
    Success,
    Failed,
}

/// Determines if a player successfully completes a pass using their `passing` skill.
/// RNG is injected for deterministic testing.
pub fn solve_pass<R: Rng>(player: &Player, rng: &mut R) -> PassOutcome {
    // Convert passing to a probability between 0.1 and 0.95
    let pass_prob = (player.skills.passing as f32 / 100.0).clamp(0.1, 0.95);

    let roll: f32 = rng.gen_range(0.0..1.0);
    if roll < pass_prob {
        PassOutcome::Success
    } else {
        PassOutcome::Failed
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::SeedableRng;

    fn make_player(passing: u8) -> Player {
        Player {
            name: "TestPlayer".to_string(),
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
            skills: crate::models::player::Skills {
                passing,
                control: 50,
                dribbling: 50,
                shooting: 50,
                finishing: 50,
                defense: 50,
                physical: 50,
                speed: 50,
                stamina: 50,
                vision: 50,
                crossing: 50,
                aggression: 50,
                composure: 50,
                intuition: 50,
                handling: 50,
                kicking: 50,
                reflexes: 50,
            },
        }
    }

    #[test]
    fn high_passing_should_succeed_often() {
        let player = make_player(90);
        let mut rng = rand::rngs::StdRng::seed_from_u64(1234);

        let mut success_count = 0;
        for _ in 0..100 {
            if solve_pass(&player, &mut rng) == PassOutcome::Success {
                success_count += 1;
            }
        }

        assert!(success_count > 70, "Expected most passes to succeed, got {success_count}");
    }

    #[test]
    fn low_passing_should_fail_often() {
        let player = make_player(30);
        let mut rng = rand::rngs::StdRng::seed_from_u64(42);

        let mut failed_count = 0;
        for _ in 0..100 {
            if solve_pass(&player, &mut rng) == PassOutcome::Failed {
                failed_count += 1;
            }
        }

        assert!(failed_count > 60, "Expected most passes to fail, got {failed_count}");
    }

    #[test]
    fn all_outcomes_possible() {
        let player = make_player(50);
        let mut rng = rand::rngs::StdRng::seed_from_u64(999);

        let mut outcomes = vec![];
        for _ in 0..200 {
            outcomes.push(solve_pass(&player, &mut rng));
        }

        assert!(outcomes.contains(&PassOutcome::Success), "Expected at least one Success");
        assert!(outcomes.contains(&PassOutcome::Failed), "Expected at least one Failed");
    }
}
