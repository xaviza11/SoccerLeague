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
    // Outfield skills
    player.skills.shooting = (player.skills.shooting + chemistry).min(99);
    player.skills.passing = (player.skills.passing + chemistry).min(99);
    player.skills.dribbling = (player.skills.dribbling + chemistry).min(99);
    player.skills.defense = (player.skills.defense + chemistry).min(99);
    player.skills.physical = (player.skills.physical + chemistry).min(99);
    player.skills.speed = (player.skills.speed + chemistry).min(99);
    player.skills.stamina = (player.skills.stamina + chemistry).min(99);
    player.skills.vision = (player.skills.vision + chemistry).min(99);
    player.skills.crossing = (player.skills.crossing + chemistry).min(99);
    player.skills.finishing = (player.skills.finishing + chemistry).min(99);
    player.skills.aggression = (player.skills.aggression + chemistry).min(99);
    player.skills.composure = (player.skills.composure + chemistry).min(99);
    player.skills.control = (player.skills.control + chemistry).min(99);

    // Goalkeeper skills
    player.skills.intuition = (player.skills.intuition + chemistry).min(99);
    player.skills.handling = (player.skills.handling + chemistry).min(99);
    player.skills.kicking = (player.skills.kicking + chemistry).min(99);
    player.skills.reflexes = (player.skills.reflexes + chemistry).min(99);
}

#[cfg(test)]
mod tests {
    use super::*;
    
    fn create_test_player() -> Player {
        Player {
            name: "Test Player".to_string(),
            country: "Testland".to_string(),
            position: "Forward".to_string(),
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
        player.card = "Killer".to_string();

        super::apply_card(&mut player, &player.card);

        assert_eq!(player.skills.finishing, 75); // original 70 + 5
        assert_eq!(player.skills.shooting, 70);  // unchanged
    }

    #[test]
    fn test_card_application_goalkeeper() {
        let mut player = create_test_player();
        player.card = "Magnet".to_string();

        super::apply_card(&mut player, &player.card);

        assert_eq!(player.skills.handling, 50); // original 45 + 5
        assert_eq!(player.skills.reflexes, 60); // unchanged
    }

    #[test]
    fn test_chemistry_application() {
        let mut player = create_test_player();
        super::apply_chemistry(&mut player, 10);

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
        super::apply_chemistry(&mut player, 50);

        // Ensure all skills are clamped to 99
        assert!(player.skills.shooting <= 99);
        assert!(player.skills.handling <= 99);
    }
}
