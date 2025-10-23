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
pub fn validate_card_for_player(player_position: &str, card_name: &str) -> Result<(), String> {
    let card_name_upper = card_name.to_uppercase();
    let is_gk = player_position.to_lowercase() == "goalkeeper";

    let valid_cards = if is_gk { GOALKEEPER_CARDS } else { OUTFIELD_CARDS };

    if valid_cards.iter().any(|&c| c.to_uppercase() == card_name_upper) {
        Ok(())
    } else {
        Err(format!("Card '{}' is NOT valid for {}", card_name, player_position))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_outfield_card() {
        let res = validate_card_for_player("Forward", "Cheetah");
        assert!(res.is_ok());

        let res = validate_card_for_player("Midfielder", "Killer");
        assert!(res.is_ok());
    }

    #[test]
    fn test_invalid_outfield_card_for_gk() {
        let res = validate_card_for_player("Goalkeeper", "Cheetah");
        assert!(res.is_err());
        assert_eq!(res.unwrap_err(), "Card 'Cheetah' is NOT valid for Goalkeeper");

        let res = validate_card_for_player("Goalkeeper", "Killer");
        assert!(res.is_err());
    }

    #[test]
    fn test_valid_goalkeeper_card() {
        let res = validate_card_for_player("Goalkeeper", "Magnet");
        assert!(res.is_ok());

        let res = validate_card_for_player("Goalkeeper", "FastHands");
        assert!(res.is_ok());
    }

    #[test]
    fn test_invalid_goalkeeper_card_for_outfield() {
        let res = validate_card_for_player("Forward", "Magnet");
        assert!(res.is_err());

        let res = validate_card_for_player("Midfielder", "Guardian");
        assert!(res.is_err());
    }

    #[test]
    fn test_invalid_card_name() {
        let res = validate_card_for_player("Forward", "FlyingBoost");
        assert!(res.is_err());

        let res = validate_card_for_player("Goalkeeper", "UltraReflex");
        assert!(res.is_err());
    }
}
