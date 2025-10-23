use rand::Rng;
use crate::models::{player::Player, player::Skills};
use crate::logics::player::generate_random_name::generate_random_name;
use crate::logics::player::generate_random_country::generate_random_country;
use crate::logics::player::generate_goalkeeper_skills::generate_goalkeeper_skills;
use crate::logics::player::generate_player_skills::generate_player_skills;

pub fn generate_random_player(position: &str, skill_range: &str) -> Player {
    println!("Generating player for position: {} with skill range: {}", position, skill_range);

    let country = generate_random_country();
    println!("Generated country: {}", country);

    let name = generate_random_name(&country);
    println!("Generated name: {}", name);

    // Parse skill_range into f32
    let skill_average: f32 = match skill_range.trim().parse() {
        Ok(value) => value,
        Err(_) => {
            panic!("Invalid skill_range '{}'. Must be a number between 0 and 99.", skill_range);
        }
    };

    let skills: Skills = if position == "Goalkeeper" {
        generate_goalkeeper_skills(skill_average)
    } else {
        generate_player_skills(skill_average)
    };

    // Generate random max_skill_level and retirement_age
    let mut rng = rand::thread_rng();
    let max_skill_level: u8 = rng.gen_range(80..=85); // 80 to 85 inclusive
    let retirement_age: u8 = rng.gen_range(35..=40);  // 35 to 40 inclusive
    let current_age: u8 = rng.gen_range(17..=30);
    let height_cm: u8 = rng.gen_range(160..=200);

    Player {
        name,
        country,
        position: position.to_string(),
        current_position: position.to_string(),
        original_position: position.to_string(),
        skills,
        age: current_age,
        is_active: true,
        injured_until: "".to_string(),
        max_skill_level,
        retirement_age,
        card: "NONE".to_string(),
        offensive_instructions: vec![],
        defensive_instructions: vec![],
        height_cm,
    }
}
