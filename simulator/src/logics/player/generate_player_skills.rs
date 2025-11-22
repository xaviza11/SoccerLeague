use crate::models::player::skills::Skills;
use crate::utils::generate_random_number::generate_number_by_range;

pub fn generate_player_skills(target_avg: f32) -> Skills {
    const FIELD_SKILLS: usize = 13;

    // Step 1: Generate initial random skills
    let mut skills: [u8; FIELD_SKILLS] = [0; FIELD_SKILLS];
    for skill in skills.iter_mut() {
        *skill = generate_number_by_range(40, 99);
    }

    // Step 2: Calculate current sum and target sum
    let target_avg = target_avg.clamp(0.0, 99.0);
    let current_sum: f32 = skills.iter().map(|&x| x as f32).sum();
    let target_sum = target_avg * FIELD_SKILLS as f32;
    let diff = target_sum - current_sum;

    // Step 3: Proportional adjustment
    if diff.abs() > 0.0 {
        // Compute total "adjustable capacity" for scaling
        let mut capacity: f32 = 0.0;
        let mut caps: Vec<f32> = Vec::with_capacity(FIELD_SKILLS);
        for &skill in skills.iter() {
            let cap = if diff > 0.0 { 99.0 - skill as f32 } else { skill as f32 };
            caps.push(cap);
            capacity += cap;
        }

        if capacity > 0.0 {
            for i in 0..FIELD_SKILLS {
                let change = diff * (caps[i] / capacity); // proportional adjustment
                let new_val = (skills[i] as f32 + change).clamp(0.0, 99.0);
                skills[i] = new_val.round() as u8;
            }
        }
    }

    Skills {
        shooting: skills[0],
        passing: skills[1],
        dribbling: skills[2],
        defense: skills[3],
        physical: skills[4],
        speed: skills[5],
        stamina: skills[6],
        vision: skills[7],
        crossing: skills[8],
        finishing: skills[9],
        aggression: skills[10],
        composure: skills[11],
        control: skills[12],
        // Goalkeeper skills
        intuition: 0,
        handling: 0,
        kicking: 0,
        reflexes: 0,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::skills::Skills;

    /// Helper to calculate the average of the 13 field skills
    fn field_average(skills: &Skills) -> f32 {
        let sum: u32 = skills.shooting as u32
            + skills.passing as u32
            + skills.dribbling as u32
            + skills.defense as u32
            + skills.physical as u32
            + skills.speed as u32
            + skills.stamina as u32
            + skills.vision as u32
            + skills.crossing as u32
            + skills.finishing as u32
            + skills.aggression as u32
            + skills.composure as u32
            + skills.control as u32;
        sum as f32 / 13.0
    }

    #[test]
    fn test_average_matches_target() {
        let target_avg = 70.0;
        let skills = generate_player_skills(target_avg);
        let avg = field_average(&skills);
        assert!(
            (avg - target_avg).abs() <= 0.5,
            "Average {} not close to target {}",
            avg,
            target_avg
        );
    }

    #[test]
    fn test_average_high_target() {
        let target_avg = 99.0;
        let skills = generate_player_skills(target_avg);
        let avg = field_average(&skills);
        assert!(
            (avg - target_avg).abs() <= 0.5,
            "Average {} not close to target {}",
            avg,
            target_avg
        );
        // Ensure no skill exceeds 99
        let field_values = [
            skills.shooting, skills.passing, skills.dribbling, skills.defense, skills.physical,
            skills.speed, skills.stamina, skills.vision, skills.crossing, skills.finishing,
            skills.aggression, skills.composure, skills.control,
        ];
        assert!(field_values.iter().all(|&x| x <= 99));
    }

    #[test]
    fn test_goalkeeper_skills_zero() {
        let target_avg = 80.0;
        let skills = generate_player_skills(target_avg);
        assert_eq!(skills.intuition, 0);
        assert_eq!(skills.handling, 0);
        assert_eq!(skills.kicking, 0);
        assert_eq!(skills.reflexes, 0);
    }

    #[test]
    fn test_average_low_target() {
        let target_avg = 40.0;
        let skills = generate_player_skills(target_avg);
        let avg = field_average(&skills);
        assert!(
            (avg - target_avg).abs() <= 0.5,
            "Average {} not close to target {}",
            avg,
            target_avg
        );
        let field_values = [
            skills.shooting, skills.passing, skills.dribbling, skills.defense, skills.physical,
            skills.speed, skills.stamina, skills.vision, skills.crossing, skills.finishing,
            skills.aggression, skills.composure, skills.control,
        ];
        assert!(field_values.iter().all(|&x| x >= 0 && x <= 99));
    }
}
