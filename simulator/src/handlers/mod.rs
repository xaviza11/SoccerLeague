pub mod player;
pub mod game;
pub mod utilities;

use actix_web::{HttpResponse, Responder};

pub async fn handle_404() -> impl Responder {
    HttpResponse::NotFound().body("Route not found")
}
