use std::collections::HashMap;
use crate::models::player::position::Position;

pub fn validate_lineup(lineup: Vec<Position>) -> Result<(), String> {
    if lineup.len() != 11 {
        return Err(format!("Invalid lineup: expected 11 players, got {}", lineup.len()));
    }

    let normalized: Vec<String> = lineup
        .iter()
        .map(|p| p.as_str().to_lowercase())
        .collect();

    let mut counts: HashMap<&str, usize> = HashMap::new();
    for pos in &normalized {
        *counts.entry(pos.as_str()).or_insert(0) += 1;
    }

    let goalkeepers = counts.get("goalkeeper").copied().unwrap_or(0);
    if goalkeepers != 1 {
        return Err(format!("Invalid lineup: expected 1 goalkeeper, got {}", goalkeepers));
    }

    let defenders = ["defender", "left_back", "right_back"]
        .iter()
        .map(|p| counts.get(p).copied().unwrap_or(0))
        .sum::<usize>();
    if !(3..=5).contains(&defenders) {
        return Err(format!("Invalid lineup: expected 3-5 defenders, got {}", defenders));
    }

    let midfielders = [
        "defensive_midfield",
        "midfielder",
        "left_midfield",
        "right_midfield",
        "attacking_midfield",
    ]
    .iter()
    .map(|p| counts.get(p).copied().unwrap_or(0))
    .sum::<usize>();
    if !(2..=5).contains(&midfielders) {
        return Err(format!("Invalid lineup: expected 2-5 midfielders, got {}", midfielders));
    }

    let strikers = ["striker", "left_wing", "right_wing"]
        .iter()
        .map(|p| counts.get(p).copied().unwrap_or(0))
        .sum::<usize>();
    if !(1..=3).contains(&strikers) {
        return Err(format!("Invalid lineup: expected 1-3 strikers, got {}", strikers));
    }

    Ok(())
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_lineup() {
        let lineup = vec![
            Position::Goalkeeper,
            Position::Defender,
            Position::Defender,
            Position::Left_Back,
            Position::Right_Back,
            Position::Midfielder,
            Position::Left_Midfield,
            Position::Right_Midfield,
            Position::Attacking_Midfield,
            Position::Striker,
            Position::Right_Wing,
        ];

        assert!(validate_lineup(lineup).is_ok());
    }

    #[test]
    fn test_invalid_number_of_players() {
        let lineup = vec![
            Position::Goalkeeper,
            Position::Defender,
        ]; // Only 2 players

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Invalid lineup: expected 11 players, got 2"
        );
    }

    #[test]
    fn test_invalid_goalkeeper_count() {
        let lineup = vec![
            Position::Goalkeeper,
            Position::Goalkeeper, // <-- 2 keepers
            Position::Defender,
            Position::Defender,
            Position::Left_Back,
            Position::Right_Back,
            Position::Midfielder,
            Position::Left_Midfield,
            Position::Right_Midfield,
            Position::Striker,
            Position::Right_Wing,
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Invalid lineup: expected 1 goalkeeper, got 2"
        );
    }

    #[test]
    fn test_invalid_defenders_count() {
        let lineup = vec![
            Position::Goalkeeper,
            Position::Defender,                  // only 1 defender
            Position::Midfielder,
            Position::Midfielder,
            Position::Midfielder,
            Position::Midfielder,
            Position::Attacking_Midfield,
            Position::Striker,
            Position::Left_Wing,
            Position::Right_Wing,
            Position::Striker,
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Invalid lineup: expected 3-5 defenders, got 1"
        );
    }

    #[test]
    fn test_invalid_midfielders_count() {
        let lineup = vec![
            Position::Goalkeeper,
            Position::Defender,
            Position::Defender,
            Position::Left_Back,
            Position::Right_Back,
            Position::Striker,
            Position::Striker,
            Position::Left_Wing,
            Position::Right_Wing,
            Position::Striker,
            Position::Right_Wing,
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Invalid lineup: expected 2-5 midfielders, got 0"
        );
    }

    #[test]
    fn test_invalid_strikers_count() {
        let lineup = vec![
            Position::Goalkeeper,
            Position::Defender,
            Position::Defender,
            Position::Left_Back,
            Position::Right_Back,
            Position::Midfielder,
            Position::Left_Midfield,
            Position::Right_Midfield,
            Position::Attacking_Midfield,
            Position::Defender,
            Position::Left_Midfield,
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "Invalid lineup: expected 1-3 strikers, got 0"
        );
    }
}




