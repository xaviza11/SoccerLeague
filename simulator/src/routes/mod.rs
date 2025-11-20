pub mod player;
pub mod game;

use actix_web::web;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    player::init(cfg);
    game::init(cfg);
}
