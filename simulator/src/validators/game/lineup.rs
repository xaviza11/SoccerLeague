pub fn validate_lineup(lineup: Vec<String>) -> bool {
    use std::collections::HashMap;

    if lineup.len() != 11 {
        return false;
    }

    let mut counts: HashMap<&str, usize> = HashMap::new();
    for pos in &lineup {
        *counts.entry(pos.as_str()).or_insert(0) += 1;
    }

    let goalkeepers = counts.get("Goalkeeper").copied().unwrap_or(0);
    if goalkeepers != 1 {
        return false;
    }

    let defenders = ["Defender", "Left Back", "Right Back"]
        .iter()
        .map(|p| counts.get(p).copied().unwrap_or(0))
        .sum::<usize>();
    if !(3..=5).contains(&defenders) {
        return false;
    }

    let midfielders = [
        "Defensive Midfield",
        "Midfielder",
        "Left Midfield",
        "Right Midfield",
        "Attacking Midfield",
    ]
    .iter()
    .map(|p| counts.get(p).copied().unwrap_or(0))
    .sum::<usize>();
    if !(2..=5).contains(&midfielders) {
        return false;
    }

    let strikers = ["Striker", "Left Wing", "Right Wing"]
        .iter()
        .map(|p| counts.get(p).copied().unwrap_or(0))
        .sum::<usize>();
    if !(1..=3).contains(&strikers) {
        return false;
    }

    true
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_lineup_433() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left Back".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Attacking Midfield".to_string(),
            "Right Wing".to_string(),
            "Striker".to_string(),
            "Left Wing".to_string(),
        ];
        assert!(validate_lineup(lineup));
    }

    #[test]
    fn test_invalid_lineup_too_many_goalkeepers() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left Back".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Attacking Midfield".to_string(),
            "Right Wing".to_string(),
            "Striker".to_string(),
            "Left Wing".to_string(),
        ];
        assert!(!validate_lineup(lineup));
    }

    #[test]
    fn test_invalid_lineup_not_enough_defenders() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Left Back".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Attacking Midfield".to_string(),
            "Right Wing".to_string(),
            "Striker".to_string(),
            "Left Wing".to_string(),
            "Striker".to_string(),
            "Midfielder".to_string(),
        ];
        assert!(!validate_lineup(lineup));
    }

    #[test]
    fn test_invalid_lineup_too_many_defenders() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left Back".to_string(),
            "Right Back".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Striker".to_string(),
            "Right Wing".to_string(),
        ];
        assert!(!validate_lineup(lineup));
    }

    #[test]
    fn test_invalid_lineup_not_enough_midfielders() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left Back".to_string(),
            "Right Back".to_string(),
            "Striker".to_string(),
            "Left Wing".to_string(),
            "Right Wing".to_string(),
            "Striker".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
        ];
        assert!(!validate_lineup(lineup));
    }

    #[test]
    fn test_invalid_lineup_too_many_midfielders() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Striker".to_string(),
            "Right Wing".to_string(),
        ];
        assert!(!validate_lineup(lineup));
    }

    #[test]
    fn test_invalid_lineup_too_many_strikers() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left Back".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Striker".to_string(),
            "Striker".to_string(),
            "Striker".to_string(),
            "Right Wing".to_string(),
        ];
        assert!(!validate_lineup(lineup));
    }

    #[test]
    fn test_invalid_lineup_too_few_strikers() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left Back".to_string(),
            "Right Back".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Attacking Midfield".to_string(),
            "Midfielder".to_string(),
            "Defender".to_string(),
            "Midfielder".to_string(),
        ];
        assert!(!validate_lineup(lineup));
    }

    #[test]
    fn test_invalid_lineup_wrong_total_count() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Left Back".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Right Wing".to_string(),
            "Left Wing".to_string(),
            "Striker".to_string(),
        ];
        assert!(!validate_lineup(lineup)); // only 9 players
    }

    #[test]
    fn test_valid_lineup_352() {
        let lineup = vec![
            "Goalkeeper".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Defender".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Midfielder".to_string(),
            "Attacking Midfield".to_string(),
            "Right Wing".to_string(),
            "Striker".to_string(),
            "Left Wing".to_string(),
        ];
        assert!(validate_lineup(lineup));
    }
}
