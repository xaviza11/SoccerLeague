use actix_web::web;
use crate::handlers::player;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.route("/player/generate", web::get().to(player::generate_player));
}
