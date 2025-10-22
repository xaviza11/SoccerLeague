use rand::Rng;
use crate::models::player::Skills;

pub fn generate_player_skills(target_avg: f32) -> Skills {
    let mut rng = rand::thread_rng();
    const FIELD_SKILLS: usize = 13;

    // Step 1: Generate random skills between 40–99
    let mut skills_array: [u8; FIELD_SKILLS] = [0; FIELD_SKILLS];
    for skill in skills_array.iter_mut() {
        *skill = rng.gen_range(40..=99);
    }

    // Step 2: Scale proportionally
    let target_avg = target_avg.clamp(0.0, 99.0);
    let current_avg: f32 = skills_array.iter().map(|&x| x as f32).sum::<f32>() / FIELD_SKILLS as f32;
    let scale = target_avg / current_avg;

    for skill in skills_array.iter_mut() {
        *skill = (*skill as f32 * scale).round().clamp(0.0, 99.0) as u8;
    }

    // Step 3: Distribute remaining difference safely in one pass
    let mut adjusted_sum: u32 = skills_array.iter().map(|&x| x as u32).sum();
    let target_sum: u32 = (target_avg * FIELD_SKILLS as f32).round() as u32;
    let diff = target_sum as i32 - adjusted_sum as i32;

    if diff != 0 {
        let mut indices: Vec<usize> = (0..FIELD_SKILLS).collect();
        for _ in 0..diff.abs() {
            if indices.is_empty() { break; }
            let idx = rng.gen_range(0..indices.len());
            let i = indices[idx];
            if diff > 0 && skills_array[i] < 99 {
                skills_array[i] += 1;
            } else if diff < 0 && skills_array[i] > 0 {
                skills_array[i] -= 1;
            }
            // Remove index if clamped
            if skills_array[i] == 0 || skills_array[i] == 99 {
                indices.remove(idx);
            }
        }
    }

    Skills {
        shooting: skills_array[0],
        passing: skills_array[1],
        dribbling: skills_array[2],
        defense: skills_array[3],
        physical: skills_array[4],
        speed: skills_array[5],
        stamina: skills_array[6],
        vision: skills_array[7],
        crossing: skills_array[8],
        finishing: skills_array[9],
        aggression: skills_array[10],
        composure: skills_array[11],
        control: skills_array[12],
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
    use crate::models::player::Skills;

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
