use std::collections::HashSet;
use crate::models::player::Player;

// Outfield cards (one card per stat)
pub const OUTFIELD_CARDS: &[&str] = &[
    "Cheetah",        // speed
    "Sniper",         // shooting
    "Commandant",     // passing & vision
    "Magician",       // dribbling & control
    "Wall",           // defense & physical
    "Horse",          // stamina
    "Fighter",        // aggression
    "Lion",           // composure
    "Quarterback",    // crossing
    "Killer",         // finishing
    "NONE"
];

// Goalkeeper cards (one card per stat)
pub const GOALKEEPER_CARDS: &[&str] = &[
    "Magnet",         // handling
    "FastHands",      // reflexes
    "Guardian",       // intuition
    "Rocket",         // kicking
    "NONE"
];

/// Validates cards for a list of players based on their position.
/// Returns `Ok(())` if all cards are valid, or an `Err(String)` describing the first invalid case.
pub fn validate_cards_for_players(players: &Vec<Player>) -> Result<(), String> {
    let mut seen_cards = HashSet::new();

    for player in players {
        let card_name_upper = player.card.to_uppercase();
        let is_gk = player.position.to_lowercase() == "goalkeeper";

        let valid_cards = if is_gk { GOALKEEPER_CARDS } else { OUTFIELD_CARDS };

        if !valid_cards.iter().any(|&c| c.to_uppercase() == card_name_upper) {
            return Err(format!("Card '{}' is NOT valid for {}", player.card, player.position));
        }

        if !seen_cards.insert(player.name.clone()) {
            return Err(format!("Duplicate player '{}' found in list", player.name));
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};

    fn make_player(name: &str, position: &str, card: &str) -> Player {
        Player {
            name: name.to_string(),
            country: "Country".to_string(),
            position: position.to_string(),
            current_position: position.to_string(),
            original_position: position.to_string(),
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
            card: card.to_string(),
            offensive_instructions: vec![],
            defensive_instructions: vec![],
            height_cm: 180,
        }
    }

    #[test]
    fn test_valid_cards_for_players() {
        let players = vec![
            make_player("John", "Forward", "Cheetah"),
            make_player("Alex", "Goalkeeper", "Magnet"),
        ];

        let result = validate_cards_for_players(&players);
        assert!(result.is_ok());
    }

    #[test]
    fn test_invalid_outfield_card_for_goalkeeper() {
        let players = vec![
            make_player("Mike", "Goalkeeper", "Cheetah"),
        ];

        let result = validate_cards_for_players(&players);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Card 'Cheetah' is NOT valid for Goalkeeper");
    }

    #[test]
    fn test_invalid_goalkeeper_card_for_outfield() {
        let players = vec![
            make_player("Leo", "Defender", "Magnet"),
        ];

        let result = validate_cards_for_players(&players);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Card 'Magnet' is NOT valid for Defender");
    }

    #[test]
    fn test_invalid_card_name() {
        let players = vec![
            make_player("Sam", "Forward", "UltraBoost"),
        ];

        let result = validate_cards_for_players(&players);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Card 'UltraBoost' is NOT valid for Forward");
    }

    #[test]
    fn test_duplicate_players() {
        let players = vec![
            make_player("Tom", "Forward", "Cheetah"),
            make_player("Tom", "Midfielder", "Sniper"),
        ];

        let result = validate_cards_for_players(&players);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Duplicate player 'Tom' found in list");
    }
}
