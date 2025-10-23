use std::collections::HashSet;
use crate::models::player::Player;

pub const VALID_OFFENSIVE: [&str; 5] = ["shoot", "pass", "dribble", "cross", "long_ball"];
pub const VALID_DEFENSIVE: [&str; 4] = ["destroy", "normal", "passive", "offside"];

/// Validates offensive and defensive instructions for an array/slice of players.
/// Returns Err if any invalid instruction is found or if a player has more than 3 instructions per type.
pub fn validate_instructions(players: &[Player]) -> Result<(), String> {
    let valid_offensive: HashSet<&str> = VALID_OFFENSIVE.iter().cloned().collect();
    let valid_defensive: HashSet<&str> = VALID_DEFENSIVE.iter().cloned().collect();

    for player in players {
        // Check for too many instructions
        if player.offensive_instructions.len() > 3 {
            return Err(format!(
                "Player '{}' has more than 3 offensive instructions",
                player.name
            ));
        }
        if player.defensive_instructions.len() > 3 {
            return Err(format!(
                "Player '{}' has more than 3 defensive instructions",
                player.name
            ));
        }

        // Validate offensive instructions
        for instr in &player.offensive_instructions {
            if !valid_offensive.contains(instr.as_str()) {
                return Err(format!(
                    "Invalid offensive instruction '{}' for player '{}'",
                    instr, player.name
                ));
            }
        }

        // Validate defensive instructions
        for instr in &player.defensive_instructions {
            if !valid_defensive.contains(instr.as_str()) {
                return Err(format!(
                    "Invalid defensive instruction '{}' for player '{}'",
                    instr, player.name
                ));
            }
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};

    fn make_player(name: &str, off: Vec<&str>, def: Vec<&str>) -> Player {
        Player {
            name: name.to_string(),
            country: "Country".to_string(),
            position: "Forward".to_string(),
            current_position: "Forward".to_string(),
            original_position: "Forward".to_string(),
            age: 25,
            is_active: true,
            injured_until: "".to_string(),
            max_skill_level: 90,
            retirement_age: 35,
            skills: Skills {
                shooting: 80,
                passing: 80,
                dribbling: 80,
                defense: 80,
                physical: 80,
                speed: 80,
                stamina: 80,
                vision: 80,
                crossing: 80,
                finishing: 80,
                aggression: 80,
                composure: 80,
                control: 80,
                intuition: 80,
                handling: 80,
                kicking: 80,
                reflexes: 80,
            },
            card: "Cheetah".to_string(),
            offensive_instructions: off.iter().map(|s| s.to_string()).collect(),
            defensive_instructions: def.iter().map(|s| s.to_string()).collect(),
            height_cm: 180,
        }
    }

    #[test]
    fn test_too_many_offensive_instructions() {
        let players = vec![
            make_player("Alice", vec!["shoot", "pass", "dribble", "cross"], vec!["destroy"]),
        ];

        let result = validate_instructions(&players);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Player 'Alice' has more than 3 offensive instructions"
        );
    }

    #[test]
    fn test_too_many_defensive_instructions() {
        let players = vec![
            make_player("Bob", vec!["shoot"], vec!["destroy", "normal", "passive", "offside"]),
        ];

        let result = validate_instructions(&players);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Player 'Bob' has more than 3 defensive instructions"
        );
    }

    #[test]
    fn test_invalid_offensive_instruction() {
        let players = vec![
            make_player("Charlie", vec!["shoot", "fly"], vec!["destroy"]),
        ];

        let result = validate_instructions(&players);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Invalid offensive instruction 'fly' for player 'Charlie'"
        );
    }

    #[test]
    fn test_invalid_defensive_instruction() {
        let players = vec![
            make_player("David", vec!["shoot"], vec!["block"]),
        ];

        let result = validate_instructions(&players);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Invalid defensive instruction 'block' for player 'David'"
        );
    }

    #[test]
    fn test_valid_instructions() {
        let players = vec![
            make_player("Eve", vec!["shoot", "pass"], vec!["destroy", "normal"]),
        ];

        let result = validate_instructions(&players);
        assert!(result.is_ok());
    }
}
