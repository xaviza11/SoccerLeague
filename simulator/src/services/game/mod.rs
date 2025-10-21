use crate::models::{player::Player, game::GameSimulation};

pub fn simulate_game(player: &Player) -> GameSimulation {
    GameSimulation {
        //player: updated,
        result: "Player improved performance!".to_string(),
    }
}
