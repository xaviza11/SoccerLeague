use crate::models::player::skills::Skills;
use crate::utils::generate_random_number::generate_number_by_range;

pub fn generate_goalkeeper_skills(target_avg: f32) -> Skills {
    const GK_SKILLS: usize = 4;

    // Step 1: Generate initial random skills 0–99
    let mut gk_array: [u8; GK_SKILLS] = [
        generate_number_by_range(0, 99),
        generate_number_by_range(0, 99),
        generate_number_by_range(0, 99),
        generate_number_by_range(0, 99),
    ];

    // Step 2: Compute current and target sum
    let target_avg = target_avg.clamp(0.0, 99.0);
    let current_sum: f32 = gk_array.iter().map(|&x| x as f32).sum();
    let target_sum = target_avg * GK_SKILLS as f32;
    let diff = target_sum - current_sum;

    // Step 3: Proportional adjustment
    if diff.abs() > 0.0 {
        // Compute total "adjustable capacity"
        let mut capacity: f32 = 0.0;
        let mut caps: Vec<f32> = Vec::with_capacity(GK_SKILLS);
        for &skill in gk_array.iter() {
            let cap = if diff > 0.0 { 99.0 - skill as f32 } else { skill as f32 };
            caps.push(cap);
            capacity += cap;
        }

        if capacity > 0.0 {
            for i in 0..GK_SKILLS {
                let change = diff * (caps[i] / capacity); // proportional adjustment
                let new_val = (gk_array[i] as f32 + change).clamp(0.0, 99.0);
                gk_array[i] = new_val.round() as u8;
            }
        }
    }

    Skills {
        shooting: 0,
        passing: 0,
        dribbling: 0,
        defense: 0,
        physical: 0,
        speed: 0,
        stamina: 0,
        vision: 0,
        crossing: 0,
        finishing: 0,
        aggression: 0,
        composure: 0,
        control: 0,
        // Goalkeeper skills
        intuition: gk_array[0],
        handling: gk_array[1],
        kicking: gk_array[2],
        reflexes: gk_array[3],
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    /// Helper to calculate average of GK skills
    fn gk_average(skills: &Skills) -> f32 {
        (skills.intuition as f32
            + skills.handling as f32
            + skills.kicking as f32
            + skills.reflexes as f32)
            / 4.0
    }

    #[test]
    fn test_goalkeeper_skills_within_bounds() {
        let target_avg = 75.0;
        let skills = generate_goalkeeper_skills(target_avg);

        let gk_values = [
            skills.intuition,
            skills.handling,
            skills.kicking,
            skills.reflexes,
        ];

        // All skills should be in 0..=99
        assert!(gk_values.iter().all(|&v| v <= 99 && v >= 0));
    }

    #[test]
    fn test_non_goalkeeper_skills_are_zero() {
        let skills = generate_goalkeeper_skills(60.0);

        assert_eq!(skills.shooting, 0);
        assert_eq!(skills.passing, 0);
        assert_eq!(skills.dribbling, 0);
        assert_eq!(skills.defense, 0);
        assert_eq!(skills.physical, 0);
        assert_eq!(skills.speed, 0);
        assert_eq!(skills.stamina, 0);
        assert_eq!(skills.vision, 0);
        assert_eq!(skills.crossing, 0);
        assert_eq!(skills.finishing, 0);
        assert_eq!(skills.aggression, 0);
        assert_eq!(skills.composure, 0);
        assert_eq!(skills.control, 0);
    }

    #[test]
    fn test_average_close_to_target() {
        let target_avg = 70.0;
        let skills = generate_goalkeeper_skills(target_avg);

        let avg = gk_average(&skills);

        // Accept a small tolerance due to rounding
        assert!(
            (avg - target_avg).abs() <= 1.0,
            "Expected average around {}, got {}",
            target_avg,
            avg
        );
    }

    #[test]
    fn test_extreme_targets() {
        let low = generate_goalkeeper_skills(0.0);
        let high = generate_goalkeeper_skills(99.0);

        let avg_low = gk_average(&low);
        let avg_high = gk_average(&high);

        // High target must produce higher average than low target
        assert!(avg_high > avg_low, "High target should be above low target");
        assert!(avg_low >= 0.0 && avg_low <= 99.0);
        assert!(avg_high >= 0.0 && avg_high <= 99.0);
    }

    #[test]
    fn test_multiple_random_calls() {
        // Run several times to ensure stability
        for _ in 0..10 {
            let skills = generate_goalkeeper_skills(65.0);
            let avg = gk_average(&skills);
            assert!((avg - 65.0).abs() <= 1.0);
        }
    }
}
