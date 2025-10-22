use std::collections::HashSet;

pub const VALID_OFFENSIVE: [&str; 5] = ["shoot", "pass", "dribble", "cross", "long_ball"];
pub const VALID_DEFENSIVE: [&str; 4] = ["destroy", "normal", "passive", "offside"];

pub fn validate_instructions(
    offensive: &mut Vec<String>,
    defensive: &mut Vec<String>,
) -> bool {
    let valid_offensive: HashSet<&str> = VALID_OFFENSIVE.iter().cloned().collect();
    let valid_defensive: HashSet<&str> = VALID_DEFENSIVE.iter().cloned().collect();

    // Trim vectors to max 3 elements
    if offensive.len() > 3 {
        offensive.truncate(3);
    }
    if defensive.len() > 3 {
        defensive.truncate(3);
    }

    // Validate content
    if !offensive.iter().all(|instr| valid_offensive.contains(instr.as_str())) {
        return false;
    }
    if !defensive.iter().all(|instr| valid_defensive.contains(instr.as_str())) {
        return false;
    }

    true
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_instructions() {
        let mut off = vec!["shoot".to_string(), "pass".to_string()];
        let mut def = vec!["destroy".to_string(), "normal".to_string()];

        assert!(validate_instructions(&mut off, &mut def));
        assert_eq!(off.len(), 2);
        assert_eq!(def.len(), 2);
    }

    #[test]
    fn test_trim_excess_elements() {
        let mut off = vec![
            "shoot".to_string(),
            "pass".to_string(),
            "dribble".to_string(),
            "cross".to_string(),
        ];
        let mut def = vec![
            "destroy".to_string(),
            "normal".to_string(),
            "passive".to_string(),
            "offside".to_string(),
        ];

        assert!(validate_instructions(&mut off, &mut def));
        assert_eq!(off.len(), 3);
        assert_eq!(def.len(), 3);
    }

    #[test]
    fn test_invalid_instruction() {
        let mut off = vec!["shoot".to_string(), "fly".to_string()]; 
        let mut def = vec!["destroy".to_string()];

        assert!(!validate_instructions(&mut off, &mut def));
    }
}
