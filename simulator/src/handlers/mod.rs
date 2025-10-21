pub mod player;
pub mod game;

use actix_web::{HttpResponse, Responder};

pub async fn handle_404() -> impl Responder {
    HttpResponse::NotFound().body("Route not found")
}
