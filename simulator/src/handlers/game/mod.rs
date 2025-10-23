use actix_web::{web, HttpResponse, Responder};
use crate::{models::game::Game, services::game};

pub async fn simulate_game(game_data: web::Json<Game>) -> impl Responder {
    println!("Received game data: {:?}", game_data);

    match game::simulate_game(game_data.into_inner()) {
        Ok(result) => HttpResponse::Ok().json(result),               // 200 Ok
        Err(err_msg) => HttpResponse::BadRequest().json(err_msg),    // 400 Bad Request
    }
}
