use actix_web::{web, HttpResponse, Responder};
use crate::{models::player::Player, services::game};

pub async fn simulate_game(player: web::Json<Player>) -> impl Responder {
    println!("Received player: {:?}", player);
    let simulation = game::simulate_game(&player.0);
    HttpResponse::Ok().json(simulation)
}
