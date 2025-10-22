use rand::Rng;

/// Resolves an action between two players based on their probabilities.
/// Returns [player_a_success, player_b_success]
pub fn probability_resolver(player_a_prob: f32, player_b_prob: f32) -> [bool; 2] {
    let mut rng = rand::thread_rng();

    let player_a_success = if player_a_prob <= 0.0 {
        false
    } else if player_a_prob >= 100.0 {
        true
    } else {
        rng.gen_range(0.0..100.0) < player_a_prob
    };

    let player_b_success = if player_b_prob <= 0.0 {
        false
    } else if player_b_prob >= 100.0 {
        true
    } else {
        rng.gen_range(0.0..100.0) < player_b_prob
    };

    [player_a_success, player_b_success]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_probability_zero() {
        // Probabilities 0% should always return false
        for _ in 0..100 {
            let result = probability_resolver(0.0, 0.0);
            assert_eq!(result, [false, false]);
        }
    }

    #[test]
    fn test_probability_hundred() {
        // Probabilities 100% should always return true
        for _ in 0..100 {
            let result = probability_resolver(100.0, 100.0);
            assert_eq!(result, [true, true]);
        }
    }

    #[test]
    fn test_probability_bounds() {
        // Probabilities less than 0% or more than 100% should clamp
        for _ in 0..100 {
            assert_eq!(probability_resolver(-10.0, 50.0)[0], false);
            assert_eq!(probability_resolver(150.0, 50.0)[0], true);
        }
    }

    #[test]
    fn test_probability_random_distribution() {
        // Probability 50% should produce roughly half true and half false over many trials
        let mut successes = 0;
        let trials = 10000;
        for _ in 0..trials {
            if probability_resolver(50.0, 50.0)[0] {
                successes += 1;
            }
        }
        let ratio = successes as f32 / trials as f32;
        // Allow ±5% tolerance
        assert!((ratio - 0.5).abs() < 0.05, "50% probability deviates too much: {}", ratio);
    }

    #[test]
    fn test_independence() {
        // Two players' outcomes should be independent
        let mut a_only = 0;
        let mut b_only = 0;
        let trials = 10000;
        for _ in 0..trials {
            let [a, b] = probability_resolver(50.0, 50.0);
            if a && !b { a_only += 1; }
            if b && !a { b_only += 1; }
        }
        // Should be non-zero in both cases
        assert!(a_only > 0);
        assert!(b_only > 0);
    }
}
