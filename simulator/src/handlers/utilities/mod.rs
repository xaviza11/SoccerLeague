use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;
use crate::services::utilities::probabilities_calculator::calculate_probabilities;

// Define the expected JSON payload
#[derive(Deserialize)]
pub struct ProbabilityRequest {
    pub probabilities_a: Vec<u8>,
    pub probabilities_b: Vec<u8>,
    pub mode: String,
}

// Actix handler
pub async fn probabilities_calculator_handler(
    game_data: web::Json<ProbabilityRequest>
) -> impl Responder {
    let data = game_data.into_inner();

    // Call your probability calculator function
    let result = calculate_probabilities(
        data.probabilities_a,
        data.probabilities_b,
        &data.mode
    );

    // Return 200 OK with the result
    HttpResponse::Ok().json(serde_json::json!({ "probability": result }))
}
