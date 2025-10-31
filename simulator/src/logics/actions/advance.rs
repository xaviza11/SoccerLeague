use crate::models::player::Player;

pub fn solve_advance(player: &mut Player) -> String {
    // Determine the next position based on the current one
    let next_position = match player.current_position.as_str() {
        "goalkeeper" => "goalkeeper",
        "defender" => "defensive_midfield",
        "left_back" => "left_midfield",
        "right_back" => "right_midfield",
        "defensive_midfield" => "midfield",
        "midfield" => "attacking_midfield",
        "attacking_midfield" => "striker",
        "left_midfield" => "left_wing",
        "right_midfield" => "right_wing",
        "left_wing" => "striker",
        "right_wing" => "striker",
        "striker" => "striker",
        _ => "unknown",
    };

    // Mutate the player's current position
    player.current_position = next_position.to_string();

    // Return the new position
    return player.current_position.to_string();
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

    fn make_player(current_position: &str) -> Player {
        Player {
            name: "John Doe".to_string(),
            country: "England".to_string(),
            position: "defender".to_string(),
            current_position: current_position.to_string(),
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
    fn test_solve_advance_changes_position() {
        let mut player = make_player("left_back");
        let result = solve_advance(&mut player);

        assert_eq!(result, "left_midfield");
        assert_eq!(player.current_position, "left_midfield");
        assert_eq!(player.original_position, "defender"); // stays same
    }

    #[test]
    fn test_solve_advance_midfield_to_attack() {
        let mut player = make_player("midfield");
        let result = solve_advance(&mut player);

        assert_eq!(result, "attacking_midfield");
        assert_eq!(player.current_position, "attacking_midfield");
    }

    #[test]
    fn test_solve_advance_striker_stays_same() {
        let mut player = make_player("striker");
        let result = solve_advance(&mut player);

        assert_eq!(result, "striker");
        assert_eq!(player.current_position, "striker");
    }
}

