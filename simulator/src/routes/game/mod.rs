use actix_web::{post, web, HttpResponse};
use serde::Deserialize;

use crate::handlers::game::simulate_game::handle_simulate_game;
use crate::models::game::team::Team;

#[derive(Deserialize)]
pub struct GameRequestBody {
    pub teams: Vec<Team>,
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(simulate_game);
}

#[post("/game/simulate")]
pub async fn simulate_game(body: web::Json<GameRequestBody>) -> HttpResponse {
    if body.teams.len() != 2 {
        return HttpResponse::BadRequest().body("This service requires 2 teams.");
    }

    let teams_array: [Team; 2] = match body.teams.clone().try_into() {
        Ok(arr) => arr,
        Err(_) => return HttpResponse::BadRequest().body("Error converting to array."),
    };

    match handle_simulate_game(teams_array) {
        Ok(game_result) => HttpResponse::Ok().json(game_result),
        Err(err) => HttpResponse::BadRequest().body(err),
    }
}
