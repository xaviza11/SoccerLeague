use crate::models::player::{Player, Skills};

/// Apply a single card to a player — each card only affects one stat
pub fn apply_card(player: &mut Player, card: &str) {
    match card {
        // Outfield cards (one stat each)
        "Cheetah" => player.skills.speed = (player.skills.speed + 5).min(99),
        "Sniper" => player.skills.shooting = (player.skills.shooting + 5).min(99),
        "Commandant" => player.skills.passing = (player.skills.passing + 5).min(99),
        "Magician" => player.skills.dribbling = (player.skills.dribbling + 5).min(99),
        "Wall" => player.skills.defense = (player.skills.defense + 5).min(99),
        "Horse" => player.skills.stamina = (player.skills.stamina + 5).min(99),
        "Fighter" => player.skills.aggression = (player.skills.aggression + 5).min(99),
        "Lion" => player.skills.composure = (player.skills.composure + 5).min(99),
        "Quarterback" => player.skills.crossing = (player.skills.crossing + 5).min(99),
        "Killer" => player.skills.finishing = (player.skills.finishing + 5).min(99),

        // Goalkeeper cards (one stat each)
        "Magnet" => player.skills.handling = (player.skills.handling + 5).min(99),
        "FastHands" => player.skills.reflexes = (player.skills.reflexes + 5).min(99),
        "Guardian" => player.skills.intuition = (player.skills.intuition + 5).min(99),
        "Rocket" => player.skills.kicking = (player.skills.kicking + 5).min(99),

        _ => {} // ignore unknown cards
    }
}

/// Apply chemistry to all player skills
pub fn apply_chemistry(player: &mut Player, chemistry: u32) {
    macro_rules! boost {
        ($skill:expr) => {
            $skill = (($skill as u32 + chemistry).min(99)) as u8;
        };
    }

    // Outfield skills
    boost!(player.skills.shooting);
    boost!(player.skills.passing);
    boost!(player.skills.dribbling);
    boost!(player.skills.defense);
    boost!(player.skills.physical);
    boost!(player.skills.speed);
    boost!(player.skills.stamina);
    boost!(player.skills.vision);
    boost!(player.skills.crossing);
    boost!(player.skills.finishing);
    boost!(player.skills.aggression);
    boost!(player.skills.composure);
    boost!(player.skills.control);

    // Goalkeeper skills
    boost!(player.skills.intuition);
    boost!(player.skills.handling);
    boost!(player.skills.kicking);
    boost!(player.skills.reflexes);
}

#[cfg(test)]
mod tests {
    use super::*;
    
    fn create_test_player() -> Player {
        Player {
            name: "Test Player".to_string(),
            country: "Testland".to_string(),
            position: "Forward".to_string(),
            current_position: "Forward".to_string(),
            original_position: "Forward".to_string(),
            age: 25,
            is_active: true,
            injured_until: "".to_string(),
            max_skill_level: 99,
            retirement_age: 40,
            card: "".to_string(),
            offensive_instructions: vec![],
            defensive_instructions: vec![],
            height_cm: 180,
            skills: Skills {
                shooting: 70,
                passing: 65,
                dribbling: 60,
                defense: 50,
                physical: 55,
                speed: 75,
                stamina: 80,
                vision: 60,
                crossing: 55,
                finishing: 70,
                aggression: 65,
                composure: 60,
                control: 70,
                intuition: 50,
                handling: 45,
                kicking: 55,
                reflexes: 60,
            },
        }
    }

    #[test]
    fn test_card_application_outfield() {
        let mut player = create_test_player();
        // Pass string literal to avoid borrow conflicts
        apply_card(&mut player, "Killer");

        assert_eq!(player.skills.finishing, 75); // original 70 + 5
        assert_eq!(player.skills.shooting, 70);  // unchanged
    }

    #[test]
    fn test_card_application_goalkeeper() {
        let mut player = create_test_player();
        apply_card(&mut player, "Magnet");

        assert_eq!(player.skills.handling, 50); // original 45 + 5
        assert_eq!(player.skills.reflexes, 60); // unchanged
    }

    #[test]
    fn test_chemistry_application() {
        let mut player = create_test_player();
        apply_chemistry(&mut player, 10);

        // Outfield skills
        assert_eq!(player.skills.shooting, 80); 
        assert_eq!(player.skills.passing, 75); 
        assert_eq!(player.skills.dribbling, 70); 
        assert_eq!(player.skills.defense, 60); 
        assert_eq!(player.skills.physical, 65); 
        assert_eq!(player.skills.speed, 85); 
        assert_eq!(player.skills.stamina, 90); 
        assert_eq!(player.skills.vision, 70); 
        assert_eq!(player.skills.crossing, 65); 
        assert_eq!(player.skills.finishing, 80); 
        assert_eq!(player.skills.aggression, 75); 
        assert_eq!(player.skills.composure, 70); 
        assert_eq!(player.skills.control, 80); 

        // Goalkeeper skills
        assert_eq!(player.skills.intuition, 60); 
        assert_eq!(player.skills.handling, 55); 
        assert_eq!(player.skills.kicking, 65); 
        assert_eq!(player.skills.reflexes, 70); 
    }

    #[test]
    fn test_max_clamp() {
        let mut player = create_test_player();
        apply_chemistry(&mut player, 50);

        // Ensure all skills are clamped to 99
        assert!(player.skills.shooting <= 99);
        assert!(player.skills.handling <= 99);
        assert!(player.skills.finishing <= 99);
        assert!(player.skills.speed <= 99);
    }
}
