use crate::models::player::Player;

/// Resets the player's current position back to their original position.
pub fn reset_position(player: &mut Player) -> String {
    player.current_position = player.original_position.clone();
    player.current_position.clone()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};

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

    fn make_player() -> Player {
        Player {
            name: "John Doe".to_string(),
            country: "England".to_string(),
            position: "defender".to_string(),
            current_position: "left_midfield".to_string(),
            original_position: "defender".to_string(),
            age: 25,
            is_active: true,
            injured_until: "".to_string(),
            max_skill_level: 90,
            retirement_age: 35,
            skills: default_skills(),
            card: "None".to_string(),
            offensive_instructions: vec![],
            defensive_instructions: vec![],
            height_cm: 180,
        }
    }

    #[test]
    fn test_reset_position() {
        let mut player = make_player();
        assert_eq!(player.current_position, "left_midfield");

        let result = reset_position(&mut player);

        assert_eq!(result, "defender");
        assert_eq!(player.current_position, "defender");
        assert_eq!(player.original_position, "defender");
    }
}
