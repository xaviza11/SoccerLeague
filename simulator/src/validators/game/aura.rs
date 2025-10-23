use std::collections::HashSet;

/// Valid auras for the team
pub const TEAM_AURAS: [&str; 12] = [
    "Sharpshooters",  // chutan mucho
    "Playmakers",     // la pasan mucho
    "Maestros",       // driblan más
    "Ironclads",      // más defensa
    "Powerhouses",    // más físico
    "Cheetahs",       // más veloces
    "Immortals",      // más stamina
    "Visionaries",    // más visión
    "Longballers",    // más pases largos
    "Snipers",        // finalizan más
    "Brawlers",       // más agresivos
    "Controllers",    // control perfecto
];

/// Validates the team auras:
/// - No more than 3 auras
/// - No duplicate auras
/// - Each aura must be valid
pub fn validate_team_aura(auras: &[String]) -> Result<(), String> {
    let valid_auras: HashSet<&str> = TEAM_AURAS.iter().cloned().collect();

    if auras.len() > 3 {
        return Err(format!(
            "A team cannot have more than 3 auras (found {})",
            auras.len()
        ));
    }

    let mut seen = HashSet::new();

    for aura in auras {
        if !valid_auras.contains(aura.as_str()) {
            return Err(format!("Invalid team aura: '{}'", aura));
        }
        if !seen.insert(aura) {
            return Err(format!("Duplicate team aura detected: '{}'", aura));
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_auras() {
        let auras = vec![
            "Sharpshooters".to_string(),
            "Playmakers".to_string(),
        ];
        assert!(validate_team_aura(&auras).is_ok());
    }

    #[test]
    fn test_too_many_auras() {
        let auras = vec![
            "Sharpshooters".to_string(),
            "Playmakers".to_string(),
            "Cheetahs".to_string(),
            "Snipers".to_string(),
        ];
        let result = validate_team_aura(&auras);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            "A team cannot have more than 3 auras (found 4)"
        );
    }

    #[test]
    fn test_invalid_aura() {
        let auras = vec![
            "Sharpshooters".to_string(),
            "FlyingBoost".to_string(),
        ];
        let result = validate_team_aura(&auras);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Invalid team aura: 'FlyingBoost'");
    }

    #[test]
    fn test_duplicate_aura() {
        let auras = vec![
            "Sharpshooters".to_string(),
            "Sharpshooters".to_string(),
        ];
        let result = validate_team_aura(&auras);
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Duplicate team aura detected: 'Sharpshooters'");
    }

    #[test]
    fn test_empty_auras() {
        let auras: Vec<String> = vec![];
        assert!(validate_team_aura(&auras).is_ok());
    }
}
