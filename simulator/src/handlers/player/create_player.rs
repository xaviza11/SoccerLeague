use crate::models::player::player::Player;
use crate::models::player::position::Position;
use std::panic;

pub fn handle_create_player(
    position: Position,
    target_avr: f32,
) -> Result<Player, String> {
    if target_avr <= 40.0 || target_avr > 85.0 {
        return Err("target_avr must be between 40.0 and 85.0".to_string());
    }

    let safe_result = panic::catch_unwind(|| {
        Player::create_new_player(
            position,
            target_avr,
        )
    });

    match safe_result {
        Ok(player) => Ok(player),
        Err(_) => Err("Unexpected error while creating player (panic captured)".to_string()),
    }
}
