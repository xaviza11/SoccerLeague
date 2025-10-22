/// Outfield cards (one card per stat)
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
];

/// Goalkeeper cards (one card per stat)
pub const GOALKEEPER_CARDS: &[&str] = &[
    "Magnet",         // handling
    "FastHands",      // reflexes
    "Guardian",       // intuition
    "Rocket",         // kicking
];

/// Validates if a card is allowed for the player based on their position
pub fn validate_card_for_player(player_position: &str, card_name: &str) -> bool {
    let card_name_upper = card_name.to_uppercase();
    let is_gk = player_position.to_lowercase() == "goalkeeper";

    let valid_cards = if is_gk { GOALKEEPER_CARDS } else { OUTFIELD_CARDS };

    valid_cards.iter().any(|&c| c.to_uppercase() == card_name_upper)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_outfield_card() {
        assert!(validate_card_for_player("Forward", "Cheetah"));
        assert!(validate_card_for_player("Midfielder", "Killer"));
    }

    #[test]
    fn test_invalid_outfield_card_for_gk() {
        assert!(!validate_card_for_player("Goalkeeper", "Cheetah"));
        assert!(!validate_card_for_player("Goalkeeper", "Killer"));
    }

    #[test]
    fn test_valid_goalkeeper_card() {
        assert!(validate_card_for_player("Goalkeeper", "Magnet"));
        assert!(validate_card_for_player("Goalkeeper", "FastHands"));
    }

    #[test]
    fn test_invalid_goalkeeper_card_for_outfield() {
        assert!(!validate_card_for_player("Forward", "Magnet"));
        assert!(!validate_card_for_player("Midfielder", "Guardian"));
    }

    #[test]
    fn test_invalid_card_name() {
        assert!(!validate_card_for_player("Forward", "FlyingBoost"));
        assert!(!validate_card_for_player("Goalkeeper", "UltraReflex"));
    }
}
