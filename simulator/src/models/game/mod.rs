use serde::{Deserialize, Serialize};
use crate::models::player::Player;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct GameSimulation {
    pub result: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Team {
    pub name: String,
    pub players: Vec<Player>,       // starting 11
    pub bench_players: Vec<Player>,  // players on the bench
    pub aura: Vec<String>,   // instructions
    pub substitutions: Vec<GameSubstitution>
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Game {
    pub team_a: Team,
    pub team_b: Team,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Data {
    pub passes: i32,
    pub passes_suc: i32,
    pub shoots: i32,
    pub shoots_suc: i32,
    pub dribbles: i32,
    pub dribbles_suc: i32,
    pub advances: i32,
    pub advances_suc: i32,
    pub long_pass: i32,
    pub long_pass_suc: i32,
    pub cross: i32,
    pub cross_suc: i32,
    pub penalties: i32,
    pub penalties_goals: i32,
    pub corners: i32,
    pub corners_goals: i32,
    pub controls: i32,
    pub controls_suc: i32,
    pub free_kicks: i32,
    pub free_kicks_suc: i32,
    pub offsides: i32,
}

    // (pass, shoot, dribble, advance, 
    // long_pass, cross, penalty, corner,
    // control, Free kick, Goal,
    // offside)

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct GameResult {
    pub score: (u8, u8),
    pub logs: Vec<String>,
    pub cards_player_a: Vec<String>,
    pub cards_player_b: Vec<String>,
    pub scorers_player_a: Vec<String>,
    pub scorers_player_b: Vec<String>,
    pub injuries_player_a: Vec<String>,
    pub injuries_player_b: Vec<String>,
    pub assistants_player_a: Vec<String>,
    pub assistants_player_b: Vec<String>,
    pub data: Data
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct GameSubstitution {
    pub minute: u8,
    pub player_out: u8,
    pub player_in: u8,
}