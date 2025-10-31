use crate::models::game::Team;
use rand::Rng;

/// Solves the outcome of a corner kick.
pub fn solve_corner(attacking_team: &Team, defending_team: &Team) -> String {
    let avg_height_att = average_height(&attacking_team.players);
    let avg_height_def = average_height(&defending_team.players);

    let mut goal_chance = 0.03;
    let mut rebound_chance = 0.20;

    if avg_height_att > avg_height_def {
        let diff = (avg_height_att - avg_height_def) as f32 / 10.0;
        goal_chance += diff * 0.01;
        rebound_chance += diff * 0.02;
    } else {
        let diff = (avg_height_def - avg_height_att) as f32 / 10.0;
        goal_chance -= diff * 0.005;
    }

    goal_chance = goal_chance.clamp(0.01, 0.10);
    rebound_chance = rebound_chance.clamp(0.10, 0.30);

    let mut rng = rand::thread_rng();
    let roll: f32 = rng.r#gen(); // ✅ escaped keyword

    if roll < goal_chance {
        "goal".to_string()
    } else if roll < goal_chance + rebound_chance {
        "rebound".to_string()
    } else {
        "cleared".to_string()
    }
}

fn average_height(players: &[crate::models::player::Player]) -> f32 {
    if players.is_empty() {
        return 175.0;
    }
    let total: u32 = players.iter().map(|p| p.height_cm as u32).sum();
    total as f32 / players.len() as f32
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};
    use crate::models::game::Team;

    fn default_skills() -> Skills {
        Skills {
            shooting: 50,
            passing: 50,
            dribbling: 50,
            defense: 50,
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
        }
    }

    fn make_player(name: &str, height: u8) -> Player {
        Player {
            name: name.to_string(),
            country: "ENG".to_string(),
            position: "defender".to_string(),
            current_position: "defender".to_string(),
            original_position: "defender".to_string(),
            age: 25,
            is_active: true,
            injured_until: "".to_string(),
            max_skill_level: 85,
            retirement_age: 35,
            skills: default_skills(),
            card: "None".to_string(),
            offensive_instructions: vec![],
            defensive_instructions: vec![],
            height_cm: height,
        }
    }

    fn make_team(name: &str, avg_height: u8) -> Team {
        let players: Vec<Player> = (0..11)
            .map(|i| make_player(&format!("{} Player {}", name, i + 1), avg_height))
            .collect();
        Team {
            name: name.to_string(),
            players,
            bench_players: vec![],
            aura: vec![],
            substitutions: vec![],
        }
    }

    #[test]
    fn test_solve_corner_returns_valid_outcome() {
        let tall_team = make_team("Tall FC", 190);
        let short_team = make_team("Short FC", 170);

        let result = solve_corner(&tall_team, &short_team);
        assert!(
            ["goal", "rebound", "cleared"].contains(&result.as_str()),
            "Unexpected outcome: {}",
            result
        );
    }

    #[test]
    fn test_average_height_calculation() {
        let team = make_team("Heights United", 180);
        let avg = average_height(&team.players);
        assert!((avg - 180.0).abs() < f32::EPSILON);
    }

    #[test]
    fn test_solve_corner_random_distribution() {
        let tall_team = make_team("Giants", 195);
        let short_team = make_team("Smol", 165);

        let mut goals = 0;
        let mut rebounds = 0;
        let mut cleared = 0;

        // Run the simulation many times to observe distribution
        for _ in 0..1000 {
            let result = solve_corner(&tall_team, &short_team);
            match result.as_str() {
                "goal" => goals += 1,
                "rebound" => rebounds += 1,
                "cleared" => cleared += 1,
                _ => panic!("Invalid result: {}", result),
            }
        }

        // Sanity checks — there should be at least some of each result
        assert!(goals > 0, "No goals recorded!");
        assert!(rebounds > 0, "No rebounds recorded!");
        assert!(cleared > 0, "No cleared results recorded!");
        assert_eq!(goals + rebounds + cleared, 1000);
    }

    #[test]
    fn test_solve_corner_with_empty_team() {
        let empty_team = Team {
            name: "Empty".to_string(),
            players: vec![],
            bench_players: vec![],
            aura: vec![],
            substitutions: vec![],
        };
        let result = solve_corner(&empty_team, &empty_team);
        assert!(
            ["goal", "rebound", "cleared"].contains(&result.as_str()),
            "Unexpected result for empty team: {}",
            result
        );
    }
}
