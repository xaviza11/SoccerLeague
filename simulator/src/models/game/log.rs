use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Log {
    pub player_name: String,
    pub minute: u8,
    pub description: String,
    pub player_number: u8,
    pub team_name: String
}