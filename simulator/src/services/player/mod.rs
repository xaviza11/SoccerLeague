use crate::models::player::player::Player;
use crate::models::player::position::Position;

pub fn create_player(country: &str, position: Position, target_avr: f32) -> Player {
    Player::create_new_player(
        position,
        target_avr
    )
}
