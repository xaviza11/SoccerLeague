use rand::Rng;
use crate::models::player::Skills;

/// Generate goalkeeper skills based on a target average.
/// Only updates the goalkeeper-specific fields, the rest are set to 0.
pub fn generate_goalkeeper_skills(target_avg: f32) -> Skills {
    let mut rng = rand::thread_rng();

    // Generate 4 skills whose average is approximately target_avg
    let mut gk_skills: [u8; 4] = [
        rng.gen_range(0..100),
        rng.gen_range(0..100),
        rng.gen_range(0..100),
        rng.gen_range(0..100),
    ];

    loop {
        let current_avg: f32 = gk_skills.iter().map(|&x| x as f32).sum::<f32>() / 4.0;
        if (current_avg - target_avg).abs() < 1.0 {
            break;
        }

        // Adjust randomly
        for skill in &mut gk_skills {
            let change: i8 = rng.gen_range(-2..=2);
            let new_value = (*skill as i8 + change).clamp(0, 99);
            *skill = new_value as u8;
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
        // Assign generated goalkeeper skills
        intuition: gk_skills[0],
        handling: gk_skills[1],
        kicking: gk_skills[2],
        reflexes: gk_skills[3],
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_goalkeeper_skills_within_range() {
        let target_avg = 75.0;
        let skills = generate_goalkeeper_skills(target_avg);

        assert!(skills.intuition <= 99);
        assert!(skills.handling <= 99);
        assert!(skills.kicking <= 99);
        assert!(skills.reflexes <= 99);
    }

    #[test]
    fn test_non_goalkeeper_skills_are_zero() {
        let target_avg = 60.0;
        let skills = generate_goalkeeper_skills(target_avg);

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
    fn test_goalkeeper_skills_average_close_to_target() {
        let target_avg = 70.0;
        let skills = generate_goalkeeper_skills(target_avg);

        let gk_values = [
            skills.intuition,
            skills.handling,
            skills.kicking,
            skills.reflexes,
        ];

        let avg = gk_values.iter().map(|&v| v as f32).sum::<f32>() / 4.0;

        assert!(
            (avg - target_avg).abs() < 1.5,
            "Expected avg around {}, got {}",
            target_avg,
            avg
        );
    }

    #[test]
    fn test_goalkeeper_skills_different_targets() {
        let low = generate_goalkeeper_skills(40.0);
        let high = generate_goalkeeper_skills(85.0);

        let avg_low = (low.intuition as f32
            + low.handling as f32
            + low.kicking as f32
            + low.reflexes as f32)
            / 4.0;
        let avg_high = (high.intuition as f32
            + high.handling as f32
            + high.kicking as f32
            + high.reflexes as f32)
            / 4.0;

        assert!(avg_high > avg_low, "Expected higher avg for higher target");
    }
}
