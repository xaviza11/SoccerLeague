pub fn calculate_probabilities(
    probabilities_a: Vec<u8>,
    probabilities_b: Vec<u8>,
    mode: &str
) -> f64 {
    // Convert to 0.0–1.0
    let a: Vec<f64> = probabilities_a.iter().map(|&p| p as f64 / 100.0).collect();
    let b: Vec<f64> = probabilities_b.iter().map(|&p| p as f64 / 100.0).collect();

    let result = match mode {
        "sequential" => a.iter().copied().product::<f64>(),

        // probability that all pairs are true simultaneously
        "both_true" => a.iter().zip(b.iter()).map(|(&pa, &pb)| pa * pb).product::<f64>(),

        // probability that all pairs are false simultaneously
        "both_false" => a.iter().zip(b.iter())
                         .map(|(&pa, &pb)| (1.0 - pa) * (1.0 - pb))
                         .product::<f64>(),

        // probability that a is true and b is false (e.g., shooter succeeds, keeper fails)
        "true_false" => a.iter().zip(b.iter())
                         .map(|(&pa, &pb)| pa * (1.0 - pb))
                         .product::<f64>(),

        _ => panic!("Unknown mode: {}", mode),
    };

    result * 100.0 // return as percentage
}

#[cfg(test)]
mod tests {
    use super::calculate_probabilities;

    #[test]
    fn test_sequential() {
        let a = vec![80, 90, 70];
        let b = vec![0, 0, 0];
        let result = calculate_probabilities(a.clone(), b, "sequential");
        // 0.8 * 0.9 * 0.7 = 0.504 -> 50.4%
        assert!((result - 50.4).abs() < 1e-6);
    }

    #[test]
    fn test_both_true() {
        let a = vec![80, 50]; // 0.8, 0.5
        let b = vec![50, 60]; // 0.5, 0.6
        let result = calculate_probabilities(a.clone(), b.clone(), "both_true");
        // (0.8*0.5) * (0.5*0.6) = 0.4 * 0.3 = 0.12 -> 12%
        assert!((result - 12.0).abs() < 1e-6);
    }

    #[test]
    fn test_both_false() {
        let a = vec![80, 50]; // 0.8, 0.5
        let b = vec![50, 60]; // 0.5, 0.6
        let result = calculate_probabilities(a.clone(), b.clone(), "both_false");
        // (1-0.8)*(1-0.5) * (1-0.5)*(1-0.4) = 0.1? let's calculate:
        // first pair: (1-0.8)*(1-0.5) = 0.2*0.5 = 0.1
        // second pair: (1-0.5)*(1-0.6) = 0.5*0.4 = 0.2
        // product: 0.1 * 0.2 = 0.02 -> 2%
        assert!((result - 2.0).abs() < 1e-6);
    }

    #[test]
    fn test_true_false() {
        let a = vec![85];
        let b = vec![85];
        let result = calculate_probabilities(a.clone(), b.clone(), "true_false");
        // 0.85 * (1-0.85) = 0.85*0.15 = 0.1275 -> 12.75%
        assert!((result - 12.75).abs() < 1e-6);
    }

    #[test]
    #[should_panic(expected = "Unknown mode")]
    fn test_unknown_mode() {
        let a = vec![80];
        let b = vec![50];
        calculate_probabilities(a, b, "unknown_mode");
    }
}
