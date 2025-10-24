pub mod player;
pub mod game;
pub mod utilities;

use actix_web::web;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    player::init(cfg);
    game::init(cfg);
    utilities::init(cfg)
}
