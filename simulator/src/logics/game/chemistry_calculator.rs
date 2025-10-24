use crate::models::player::Player;

fn chemistry_calculator(countries: [&str; 11]) -> u32 {
    let mut unique: [&str; 11] = [""; 11];
    let mut counts: [u32; 11] = [0; 11];
    let mut unique_count = 0;

    for &country in countries.iter() {
        // check if country is already in unique array
        if let Some(pos) = unique[..unique_count].iter().position(|&c| c == country) {
            counts[pos] += 1; // increment count if exists
        } else {
            unique[unique_count] = country;
            counts[unique_count] = 1;
            unique_count += 1;
        }
    }

    // sum points with rules: 1 ->0, 2->2, 3->3, 4->4, 5->5, 6+ ->5
    counts[..unique_count]
        .iter()
        .map(|&c| match c {
            1 => 0,
            2..=5 => c,
            _ => 5,
        })
        .sum()
}

pub fn calculate_chemistry(players: &mut Vec<Player>) {
    if players.len() != 11 {
        panic!("Exactly 11 players are required for chemistry calculation");
    }

    let countries: [&str; 11] = players
        .iter()
        .map(|p| p.country.as_str())
        .collect::<Vec<&str>>()
        .try_into()
        .expect("Failed to collect 11 countries");

    let chemistry = chemistry_calculator(countries);

    for player in players.iter_mut() {
        let s = &mut player.skills;

        // Add chemistry points to each skill, capping at 99
        s.shooting = (s.shooting.saturating_add(chemistry as u8)).min(99);
        s.passing = (s.passing.saturating_add(chemistry as u8)).min(99);
        s.dribbling = (s.dribbling.saturating_add(chemistry as u8)).min(99);
        s.defense = (s.defense.saturating_add(chemistry as u8)).min(99);
        s.physical = (s.physical.saturating_add(chemistry as u8)).min(99);
        s.speed = (s.speed.saturating_add(chemistry as u8)).min(99);
        s.stamina = (s.stamina.saturating_add(chemistry as u8)).min(99);
        s.vision = (s.vision.saturating_add(chemistry as u8)).min(99);
        s.crossing = (s.crossing.saturating_add(chemistry as u8)).min(99);
        s.finishing = (s.finishing.saturating_add(chemistry as u8)).min(99);
        s.aggression = (s.aggression.saturating_add(chemistry as u8)).min(99);
        s.composure = (s.composure.saturating_add(chemistry as u8)).min(99);
        s.control = (s.control.saturating_add(chemistry as u8)).min(99);
        s.intuition = (s.intuition.saturating_add(chemistry as u8)).min(99);
        s.handling = (s.handling.saturating_add(chemistry as u8)).min(99);
        s.kicking = (s.kicking.saturating_add(chemistry as u8)).min(99);
        s.reflexes = (s.reflexes.saturating_add(chemistry as u8)).min(99);
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_example() {
        let countries = ["Spain","Spain","Spain","Spain","Spain","Spain","France","France","Brasil","Salvador","Costa Rica"];
        assert_eq!(chemistry_calculator(countries), 7);
    }
    
    #[test] fn six_countries() {
        let countries = ["A","A","A","A","A","A","B","B","C","C","D"];
        // A 6 ->5, B 2->2, C 2->2, D 1->0 = 9
        assert_eq!(chemistry_calculator(countries), 9);
    }

    #[test]
    fn test_various_counts() {
        let countries = ["Spain","Spain","France","France","France","Italy","Italy","Italy","Italy","Italy","Germany"];
        // Spain 2 ->2, France 3->3, Italy 5->5, Germany 1->0 = 10
        assert_eq!(chemistry_calculator(countries), 10);
    }

    #[test]
    fn test_all_ones() {
        let countries = ["A","B","C","D","E","F","G","H","I","J","K"];
        assert_eq!(chemistry_calculator(countries), 0);
    }
}


#[cfg(test)]
mod chemistry_tests {
    use super::*;
    use crate::models::player::{Player, Skills};

    fn create_player(name: &str, country: &str, skill_value: u8) -> Player {
        Player {
            name: name.to_string(),
            country: country.to_string(),
            position: "Midfielder".to_string(),
            current_position: "Midfielder".to_string(),
            original_position: "Midfielder".to_string(),
            age: 25,
            is_active: true,
            injured_until: "".to_string(),
            max_skill_level: skill_value,
            retirement_age: 35,
            skills: Skills {
                shooting: skill_value,
                passing: skill_value,
                dribbling: skill_value,
                defense: skill_value,
                physical: skill_value,
                speed: skill_value,
                stamina: skill_value,
                vision: skill_value,
                crossing: skill_value,
                finishing: skill_value,
                aggression: skill_value,
                composure: skill_value,
                control: skill_value,
                intuition: skill_value,
                handling: skill_value,
                kicking: skill_value,
                reflexes: skill_value,
            },
            card: "".to_string(),
            offensive_instructions: vec![],
            defensive_instructions: vec![],
            height_cm: 180,
        }
    }

    #[test]
    fn test_skills_increased_by_chemistry() {
        // Create 11 players, 2 countries repeated
        let mut players = vec![
            create_player("P1", "A", 50),
            create_player("P2", "A", 50),
            create_player("P3", "B", 50),
            create_player("P4", "B", 50),
            create_player("P5", "C", 50),
            create_player("P6", "D", 50),
            create_player("P7", "E", 50),
            create_player("P8", "F", 50),
            create_player("P9", "G", 50),
            create_player("P10", "H", 50),
            create_player("P11", "I", 50),
        ];

        // Chemistry: A 2->2, B 2->2, C-H-I 1->0 => total 4
        calculate_chemistry(&mut players);

        for player in players.iter() {
            assert_eq!(player.skills.shooting, 54);
            assert_eq!(player.skills.passing, 54);
            assert_eq!(player.skills.dribbling, 54);
        }
    }

    #[test]
    fn test_skills_capped_at_99() {
        // Players with high initial skill
        let mut players = vec![
            create_player("P1", "A", 97),
            create_player("P2", "A", 97),
            create_player("P3", "B", 97),
            create_player("P4", "B", 97),
            create_player("P5", "C", 97),
            create_player("P6", "D", 97),
            create_player("P7", "E", 97),
            create_player("P8", "F", 97),
            create_player("P9", "G", 97),
            create_player("P10", "H", 97),
            create_player("P11", "I", 97),
        ];

        // Chemistry: same as above, total 4
        calculate_chemistry(&mut players);

        for player in players.iter() {
            // 97 + 4 = 101 → capped at 99
            assert_eq!(player.skills.shooting, 99);
            assert_eq!(player.skills.passing, 99);
            assert_eq!(player.skills.dribbling, 99);
        }
    }
}
