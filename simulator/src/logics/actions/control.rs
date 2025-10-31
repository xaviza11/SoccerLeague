use rand::Rng;
use crate::models::player::Player;

#[derive(Debug, PartialEq, Eq)]
pub enum ControlOutcome {
    Controlled,
    Lost,
}

///`control`.
/// RNG.
pub fn control_ball<R: Rng>(player: &Player, rng: &mut R) -> ControlOutcome {
    // Convertimos control a probabilidad entre 0.1 y 0.95
    let control_prob = (player.skills.control as f32 / 100.0).clamp(0.1, 0.95);

    let roll: f32 = rng.gen_range(0.0..1.0);
    if roll < control_prob {
        ControlOutcome::Controlled
    } else {
        ControlOutcome::Lost
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::SeedableRng;

    fn make_player(control: u8) -> Player {
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
                control,
                passing: 50,
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
    fn high_control_should_succeed_often() {
        let player = make_player(90);
        let mut rng = rand::rngs::StdRng::seed_from_u64(1234);

        let mut controlled_count = 0;
        for _ in 0..100 {
            if control_ball(&player, &mut rng) == ControlOutcome::Controlled {
                controlled_count += 1;
            }
        }

        assert!(controlled_count > 70, "Expected most controls to succeed, got {controlled_count}");
    }

    #[test]
    fn low_control_should_fail_often() {
        let player = make_player(30);
        let mut rng = rand::rngs::StdRng::seed_from_u64(42);

        let mut lost_count = 0;
        for _ in 0..100 {
            if control_ball(&player, &mut rng) == ControlOutcome::Lost {
                lost_count += 1;
            }
        }

        assert!(lost_count > 60, "Expected most controls to fail, got {lost_count}");
    }

    #[test]
    fn all_outcomes_possible() {
        let player = make_player(50);
        let mut rng = rand::rngs::StdRng::seed_from_u64(999);

        let mut outcomes = vec![];
        for _ in 0..200 {
            outcomes.push(control_ball(&player, &mut rng));
        }

        assert!(outcomes.contains(&ControlOutcome::Controlled), "Expected at least one Controlled");
        assert!(outcomes.contains(&ControlOutcome::Lost), "Expected at least one Lost");
    }
}
