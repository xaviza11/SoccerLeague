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

    // ✅ Delanteros: 1-3
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
            "goalkeeper".to_string(),
            "defender".to_string(),
            "defender".to_string(),
            "left_back".to_string(),
            "right_back".to_string(),
            "midfielder".to_string(),
            "left_midfield".to_string(),
            "right_midfield".to_string(),
            "attacking_midfield".to_string(),
            "striker".to_string(),
            "right_wing".to_string(),
        ];

        assert!(validate_lineup(lineup).is_ok());
    }

    #[test]
    fn test_invalid_number_of_players() {
        let lineup = vec![
            "goalkeeper".to_string(),
            "defender".to_string(),
        ]; // Only 2 players

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 11 players, got 2");
    }

    #[test]
    fn test_invalid_goalkeeper_count() {
        let lineup = vec![
            "goalkeeper".to_string(),
            "goalkeeper".to_string(),
            "defender".to_string(),
            "defender".to_string(),
            "left_back".to_string(),
            "Right Back".to_string(),
            "midfielder".to_string(),
            "left_midfield".to_string(),
            "right_midfield".to_string(),
            "striker".to_string(),
            "right_wing".to_string(),
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 1 goalkeeper, got 2");
    }

    #[test]
    fn test_invalid_defenders_count() {
        let lineup = vec![
            "goalkeeper".to_string(),
            "defender".to_string(),
            "midfielder".to_string(),
            "midfielder".to_string(),
            "midfielder".to_string(),
            "midfielder".to_string(),
            "Attacking Midfield".to_string(),
            "striker".to_string(),
            "Left_Wing".to_string(),
            "right_wing".to_string(),
            "striker".to_string(),
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 3-5 defenders, got 1");
    }

    #[test]
    fn test_invalid_midfielders_count() {
        let lineup = vec![
            "goalkeeper".to_string(),
            "defender".to_string(),
            "defender".to_string(),
            "left_back".to_string(),
            "right_back".to_string(),
            "striker".to_string(),
            "striker".to_string(),
            "Left_Wing".to_string(),
            "right_wing".to_string(),
            "striker".to_string(),
            "right_wing".to_string(),
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 2-5 midfielders, got 0");
    }

    #[test]
    fn test_invalid_strikers_count() {
        let lineup = vec![
            "goalkeeper".to_string(),
            "defender".to_string(),
            "defender".to_string(),
            "left_back".to_string(),
            "right_back".to_string(),
            "midfielder".to_string(),
            "left_midfield".to_string(),
            "right_midfield".to_string(),
            "attacking_midfield".to_string(),
            "defender".to_string(),
            "left_midfield".to_string(),
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 1-3 strikers, got 0");
    }
}



