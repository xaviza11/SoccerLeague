use serde::{ Deserialize, Serialize };
use crate::models::game::team_stats::TeamStats;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct GameResult {
    pub score: [u8; 2],
    //pub teams_stats: [TeamStats; 2],
}

impl GameResult {
    pub fn create() -> Self {
        Self {
            score: [0, 0],
            //teams_stats: [TeamStats::default(), TeamStats::default()],
        }
    }
}

