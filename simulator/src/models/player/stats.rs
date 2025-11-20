use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Stats {
    pub goals: i32,
    pub total_shots: i32,
    pub total_passes: i32,
    pub faults: i32,
    pub assists: i32,
    pub red_cards: i32,
    pub yellow_cards: i32,
    pub total_games: i32,
}

impl Stats {
    pub fn generate_default_status() -> Self {
        Self {
            goals: 0,
            total_shots: 0,
            faults: 0,
            total_passes: 0,
            assists: 0,
            red_cards: 0, 
            yellow_cards: 0,
            total_games: 0
        }
    }
}
