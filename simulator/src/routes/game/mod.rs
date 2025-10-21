use actix_web::web;
use crate::handlers::game;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.route("/game/simulate", web::post().to(game::simulate_game));
}
