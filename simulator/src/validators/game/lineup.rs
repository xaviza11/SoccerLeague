use std::collections::HashMap;

pub fn validate_lineup(lineup: Vec<String>) -> Result<(), String> {
    if lineup.len() != 11 {
        return Err(format!("Invalid lineup: expected 11 players, got {}", lineup.len()));
    }

    let mut counts: HashMap<&str, usize> = HashMap::new();
    for pos in &lineup {
        *counts.entry(pos.as_str()).or_insert(0) += 1;
    }

    let goalkeepers = counts.get("Goalkeeper").copied().unwrap_or(0);
    if goalkeepers != 1 {
        return Err(format!("Invalid lineup: expected 1 Goalkeeper, got {}", goalkeepers));
    }

    let defenders = ["Defender", "Left_Back", "Right_Back"]
        .iter()
        .map(|p| counts.get(p).copied().unwrap_or(0))
        .sum::<usize>();
    if !(3..=5).contains(&defenders) {
        return Err(format!("Invalid lineup: expected 3-5 Defenders, got {}", defenders));
    }

    let midfielders = [
        "Defensive_Midfield",
        "Midfielder",
        "Left_Midfield",
        "Right_Midfield",
        "Attacking_Midfield",
    ]
    .iter()
    .map(|p| counts.get(p).copied().unwrap_or(0))
    .sum::<usize>();
    if !(2..=5).contains(&midfielders) {
        return Err(format!("Invalid lineup: expected 2-5 Midfielders, got {}", midfielders));
    }

    let strikers = ["Striker", "Left_Wing", "Right_Wing"]
        .iter()
        .map(|p| counts.get(p).copied().unwrap_or(0))
        .sum::<usize>();
    if !(1..=3).contains(&strikers) {
        return Err(format!("Invalid lineup: expected 1-3 Strikers, got {}", strikers));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_lineup() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left_Back".to_string(),
            "Right_Back".to_string(),
            "Midfielder".to_string(),
            "Left_Midfield".to_string(),
            "Right_Midfield".to_string(),
            "Attacking_Midfield".to_string(),
            "Striker".to_string(),
            "Right_Wing".to_string(),
        ];

        assert!(validate_lineup(lineup).is_ok());
    }

    #[test]
    fn test_invalid_number_of_players() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
        ]; // Only 2 players

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 11 players, got 2");
    }

    #[test]
    fn test_invalid_goalkeeper_count() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left_Back".to_string(),
            "Right Back".to_string(),
            "Midfielder".to_string(),
            "Left_Midfield".to_string(),
            "Right_Midfield".to_string(),
            "Striker".to_string(),
            "Right_Wing".to_string(),
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 1 Goalkeeper, got 2");
    }

    #[test]
    fn test_invalid_defenders_count() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Attacking Midfield".to_string(),
            "Striker".to_string(),
            "Left_Wing".to_string(),
            "Right_Wing".to_string(),
            "Striker".to_string(),
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 3-5 Defenders, got 1");
    }

    #[test]
    fn test_invalid_midfielders_count() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left_Back".to_string(),
            "Right_Back".to_string(),
            "Striker".to_string(),
            "Striker".to_string(),
            "Left_Wing".to_string(),
            "Right_Wing".to_string(),
            "Striker".to_string(),
            "Right_Wing".to_string(),
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 2-5 Midfielders, got 0");
    }

    #[test]
    fn test_invalid_strikers_count() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left_Back".to_string(),
            "Right_Back".to_string(),
            "Midfielder".to_string(),
            "Left_Midfield".to_string(),
            "Right_Midfield".to_string(),
            "Attacking_Midfield".to_string(),
            "Defender".to_string(),
            "Left_Midfield".to_string(),
        ];

        let result = validate_lineup(lineup);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid lineup: expected 1-3 Strikers, got 0");
    }
}



