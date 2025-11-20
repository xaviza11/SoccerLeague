// src/routes/player.rs
use actix_web::{get, web, HttpResponse};
use serde::Deserialize;
use crate::models::player::position::Position;
use crate::handlers::player::create_player::handle_create_player;

#[derive(Deserialize)]
pub struct PlayerQuery {
    pub position: Position,
    pub target_avr: Option<f32>,  
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(generate_player);
}

#[get("/player/generate")]
pub async fn generate_player(query: web::Query<PlayerQuery>) -> HttpResponse {
    let target_avr = match query.target_avr {
        Some(val) if val >= 40.0 && val <= 85.0 => val,
        _ => return HttpResponse::BadRequest().body("Missing or invalid parameter: target_avr (40.0 - 85.0)"),
    };

    match handle_create_player(query.position.clone(), target_avr) {
        Ok(player) => HttpResponse::Ok().json(player),
        Err(err) => HttpResponse::BadRequest().body(err),
    }
}
