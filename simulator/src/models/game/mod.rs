use serde::{Deserialize, Serialize};
use crate::models::player::Player;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct GameSimulation {
    pub result: String,
}
