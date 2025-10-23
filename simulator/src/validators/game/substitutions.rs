use std::collections::HashSet;

pub struct Substitution {
    pub minute: u8,
    pub player_out: u8,
    pub player_in: u8,
}

pub struct Substitutions {
    pub substitutions: Vec<Substitution>,
}

pub struct ValidationResult {
    pub is_valid: bool,
    pub message: String,
}

pub fn validate_substitutions(substitutions: &Vec<Substitutions>) -> ValidationResult {
    if substitutions.len() > 3 {
        return ValidationResult {
            is_valid: false,
            message: "Too many substitution groups (max 3 allowed)".into(),
        };
    }

    let mut players_in = HashSet::new();
    let mut players_out = HashSet::new();

    for sub_group in substitutions {
        for sub in &sub_group.substitutions {
            if !players_in.insert(sub.player_in) {
                return ValidationResult {
                    is_valid: false,
                    message: format!("Player {} is substituted in more than once", sub.player_in),
                };
            }

            if !players_out.insert(sub.player_out) {
                return ValidationResult {
                    is_valid: false,
                    message: format!("Player {} is substituted out more than once", sub.player_out),
                };
            }
        }
    }

    ValidationResult {
        is_valid: true,
        message: "All substitutions are valid".into(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_substitutions() {
        let subs = vec![
            Substitutions {
                substitutions: vec![
                    Substitution { minute: 30, player_out: 5, player_in: 12 },
                    Substitution { minute: 60, player_out: 8, player_in: 15 },
                ],
            },
            Substitutions {
                substitutions: vec![
                    Substitution { minute: 75, player_out: 10, player_in: 18 },
                ],
            },
        ];

        let result = validate_substitutions(&subs);
        assert!(result.is_valid);
    }

    #[test]
    fn test_duplicate_player_in() {
        let subs = vec![
            Substitutions {
                substitutions: vec![
                    Substitution { minute: 30, player_out: 5, player_in: 12 },
                    Substitution { minute: 60, player_out: 8, player_in: 12 }, // duplicate in
                ],
            },
        ];

        let result = validate_substitutions(&subs);
        assert!(!result.is_valid);
        assert_eq!(result.message, "Player 12 is substituted in more than once");
    }

    #[test]
    fn test_duplicate_player_out() {
        let subs = vec![
            Substitutions {
                substitutions: vec![
                    Substitution { minute: 30, player_out: 5, player_in: 12 },
                    Substitution { minute: 60, player_out: 5, player_in: 15 }, // duplicate out
                ],
            },
        ];

        let result = validate_substitutions(&subs);
        assert!(!result.is_valid);
        assert_eq!(result.message, "Player 5 is substituted out more than once");
    }

    #[test]
    fn test_too_many_substitution_groups() {
        let subs = vec![
            Substitutions { substitutions: vec![Substitution { minute: 10, player_out: 1, player_in: 11 }] },
            Substitutions { substitutions: vec![Substitution { minute: 20, player_out: 2, player_in: 12 }] },
            Substitutions { substitutions: vec![Substitution { minute: 30, player_out: 3, player_in: 13 }] },
            Substitutions { substitutions: vec![Substitution { minute: 40, player_out: 4, player_in: 14 }] }, // 4th group
        ];

        let result = validate_substitutions(&subs);
        assert!(!result.is_valid);
        assert_eq!(result.message, "Too many substitution groups (max 3 allowed)");
    }

    #[test]
    fn test_empty_substitutions() {
        let subs: Vec<Substitutions> = vec![];
        let result = validate_substitutions(&subs);
        assert!(result.is_valid);
        assert_eq!(result.message, "All substitutions are valid");
    }
}
