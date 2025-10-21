use rand::Rng;
use crate::models::player::Skills;

/// Generate field player skills based on a target average.
/// Only updates general field skills, goalkeeper-specific skills are set to 0.
pub fn generate_player_skills(target_avg: f32) -> Skills {
    let mut rng = rand::thread_rng();

    // Generate 13 random skills between 40 and 99
    let mut skills_array: [u8; 13] = [0; 13];
    for skill in skills_array.iter_mut() {
        *skill = rng.gen_range(40..=99);
    }

    // Adjust proportionally to reach target_avg
    let current_avg: f32 = skills_array.iter().map(|&x| x as f32).sum::<f32>() / skills_array.len() as f32;
    let diff = target_avg - current_avg;

    for skill in skills_array.iter_mut() {
        let adjusted = (*skill as f32 + diff).round().clamp(0.0, 99.0);
        *skill = adjusted as u8;
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
