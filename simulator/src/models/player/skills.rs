use serde::{Deserialize, Serialize};
use crate::logics::player::generate_player_skills::generate_player_skills;
use crate::logics::player::generate_goalkeeper_skills::generate_goalkeeper_skills;

use crate::models::player::position::Position;

// Struct representing a player's abilities and skills
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Skills {
    // General skills (applicable to all positions)
    // Ability to long shots (0-99)
    pub shooting: u8,

    // Ability to pass the ball effectively (0-99)
    pub passing: u8,

    // Skill in dribbling past opponents (0-99)
    pub dribbling: u8,
    
    // Defensive capabilities, tackling and marking (0-99)
    pub defense: u8,
    
    // Physical strength and body balance (0-99)
    pub physical: u8,
    
    // Sprint speed and acceleration (0-99)
    pub speed: u8,
    
    // Endurance to maintain performance over time (0-99)
    pub stamina: u8,
    
    // Vision for long passes and game strategy (0-99)
    pub vision: u8,
    
    // Ability to cross the ball accurately (0-99)
    pub crossing: u8,
    
    // Skill in finishing scoring opportunities (0-99)
    pub finishing: u8,
    
    // Aggressiveness and intensity in challenges (0-99)
    pub aggression: u8,
    
    // Composure and decision making under pressure for penalty kicks (0-99)
    pub composure: u8,

    // Skill for have the ball under control on the firsts touches (0-99) 
    pub control: u8,

    // Goalkeeper specific skills (optional for outfield players)
    // Ability for stop a penalty kick (0-99)
    pub intuition: u8,

    // Ability to securely catch or block the ball (0-99)
    pub handling: u8,
    
    // Accuracy and power when kicking or distributing the ball (0-99)
    pub kicking: u8,

    // Ability to stop shots on goal (0-99)
    pub reflexes: u8,
}

impl Skills {
    pub fn generate_skills(position: &Position, target_avr: f32) -> Self {
        match position {
            Position::Goalkeeper => generate_goalkeeper_skills(target_avr),
            _ => generate_player_skills(target_avr),
        }
    }

    
}