use actix_web::{web, HttpResponse, Responder};
use crate::{models::player::Player, services::player};
use serde::Deserialize;
use std::panic;
use crate::validators::player::position::validate_position;

#[derive(Deserialize)]
pub struct Params {
    position: String,
    skill_range: String,
}

pub async fn generate_player(query: web::Query<Params>) -> impl Responder {
    let safe_call = panic::catch_unwind(|| {
        player::generate_random_player(&query.position, &query.skill_range)
    });

    let validate_position = validate_position(&query.position);

    if(validate_position == "NONE") {
        return HttpResponse::BadRequest().json(
            serde_json::json!({
                "error": "Invalid position provided"
            }),
        );      
    }

    match safe_call {
        Ok(player) => HttpResponse::Ok().json(player),
        Err(_) => HttpResponse::InternalServerError().json(
            serde_json::json!({
                "error": "Unexpected panic during player generation"
            }),
        ),
    }
}
