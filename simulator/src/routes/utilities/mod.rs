use actix_web::web;
use crate::handlers::utilities::probabilities_calculator_handler;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.route(
        "/utilities/probabilities_calculator",
        web::post().to(probabilities_calculator_handler) // use POST for JSON
    );
}
