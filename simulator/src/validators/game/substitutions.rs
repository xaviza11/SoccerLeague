use std::collections::HashSet;
use crate::models::game::GameSubstitution;

pub struct Substitution {
    pub minute: u8,
    pub player_out: u8,
    pub player_in: u8,
}

pub struct Substitutions {
    pub substitutions: Vec<Substitution>,
}

pub fn validate_substitutions(substitutions: &Vec<GameSubstitution>) -> Result<(), String> {
    if substitutions.len() > 3 {
        return Err("Too many substitutions (max 3 allowed)".into());
    }

    let mut players_in = HashSet::new();
    let mut players_out = HashSet::new();

    for sub in substitutions {
        if !players_in.insert(sub.player_in) {
            return Err(format!("Player {} is substituted in more than once", sub.player_in));
        }
        if !players_out.insert(sub.player_out) {
            return Err(format!("Player {} is substituted out more than once", sub.player_out));
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::game::GameSubstitution;

    fn gs(minute: u8, player_out: u8, player_in: u8) -> GameSubstitution {
        GameSubstitution { minute, player_out, player_in }
    }

    #[test]
    fn test_valid_substitutions() {
        let subs = vec![
            gs(30, 5, 12),
            gs(60, 8, 15),
            gs(75, 10, 18),
        ];

        let result = validate_substitutions(&subs);
        assert!(result.is_ok());
    }

    #[test]
    fn test_duplicate_player_in() {
        let subs = vec![
            gs(30, 5, 12),
            gs(60, 8, 12), // same player_in
        ];

        let result = validate_substitutions(&subs);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Player 12 is substituted in more than once");
    }

    #[test]
    fn test_duplicate_player_out() {
        let subs = vec![
            gs(30, 5, 12),
            gs(60, 5, 15), // same player_out
        ];

        let result = validate_substitutions(&subs);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Player 5 is substituted out more than once");
    }

    #[test]
    fn test_too_many_substitutions() {
        let subs = vec![
            gs(10, 1, 11),
            gs(20, 2, 12),
            gs(30, 3, 13),
            gs(40, 4, 14), // 4th substitution
        ];

        let result = validate_substitutions(&subs);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Too many substitutions (max 3 allowed)");
    }

    #[test]
    fn test_empty_substitutions() {
        let subs: Vec<GameSubstitution> = vec![];
        let result = validate_substitutions(&subs);
        assert!(result.is_ok());
    }
}
