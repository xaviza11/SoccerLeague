pub fn validate_position(position: &str) -> String {
    const VALID_POSITIONS: &[&str] = &[
        "Goalkeeper",
        "Defender",
        "Left_Back",
        "Right_Back",
        "Defensive_Midfield",
        "Midfielder",
        "Center_Back",
        "Left_Midfield",
        "Right_Midfield",
        "Attacking_Midfield",
        "Left_Wing",
        "Right_Wing",
        "Striker",
    ];

    VALID_POSITIONS
        .iter()
        .any(|&valid| valid.eq_ignore_ascii_case(position));

    if VALID_POSITIONS
        .iter()
        .any(|&valid| valid.eq_ignore_ascii_case(position))
    {
        position.to_string()
    } else {
        "NONE".to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_position_valid_exact() {
        assert_eq!(validate_position("Goalkeeper"), "Goalkeeper");
        assert_eq!(validate_position("Defender"), "Defender");
        assert_eq!(validate_position("Striker"), "Striker");
    }

    #[test]
    fn test_validate_position_valid_case_insensitive() {
        assert_eq!(validate_position("goalkeeper"), "goalkeeper");
        assert_eq!(validate_position("sTrIkEr"), "sTrIkEr");
        assert_eq!(validate_position("midfielder"), "midfielder");
    }

    #[test]
    fn test_validate_position_invalid() {
        assert_eq!(validate_position("Wizard"), "NONE");
        assert_eq!(validate_position("Coach"), "NONE");
        assert_eq!(validate_position(""), "NONE");
    }
}


