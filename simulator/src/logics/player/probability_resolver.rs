#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_zero_probability_player() {
        // Player A 0 → always false
        for _ in 0..10 {
            let result = probability_resolver(0.0, 50.0);
            assert_eq!(result[0], false);
            assert!(result[1] == true || result[1] == false);
        }

        // Player B 0 → always false
        for _ in 0..10 {
            let result = probability_resolver(50.0, 0.0);
            assert_eq!(result[1], false);
            assert!(result[0] == true || result[0] == false);
        }
    }

    #[test]
    fn test_hundred_probability_player() {
        // Player A 100 → always true
        let result = probability_resolver(100.0, 50.0);
        assert_eq!(result[0], true);
        assert!(result[1] == true || result[1] == false);

        // Player B 100 → always true
        let result = probability_resolver(50.0, 100.0);
        assert_eq!(result[1], true);
        assert!(result[0] == true || result[0] == false);

        // Both 100 → both true
        let result = probability_resolver(100.0, 100.0);
        assert_eq!(result, [true, true]);
    }

    #[test]
    fn test_both_zero_probability() {
        let result = probability_resolver(0.0, 0.0);
        assert_eq!(result, [false, false]);
    }

    #[test]
    fn test_normal_probabilities() {
        // Just make sure output is always boolean
        for _ in 0..50 {
            let result = probability_resolver(30.0, 70.0);
            assert!(result[0] == true || result[0] == false);
            assert!(result[1] == true || result[1] == false);
        }
    }
}
