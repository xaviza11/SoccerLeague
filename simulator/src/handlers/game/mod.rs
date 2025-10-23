use actix_web::{web, HttpResponse, Responder};
use crate::{models::game::Game, services::game};

pub async fn simulate_game(game_data: web::Json<Game>) -> impl Responder {
    match game::simulate_game(game_data.into_inner()) {
        Ok(result) => HttpResponse::Ok().json(result), // 200 OK
        Err(err) => {
            // Convert actix_web::Error to a string for safe JSON response
            let err_msg = format!("{}", err);
            HttpResponse::BadRequest().json(serde_json::json!({ "error": err_msg }))
        }
    }
}

