use crate::models::game::game::GameReturn;
use crate::models::game::team::Team;
use crate::services::game::simulate_new_game;
use std::panic;

pub fn handle_simulate_game(teams: [Team; 2]) -> Result<GameReturn, String> {
    // Validate starters and bench for both teams
    for (i, team) in teams.iter().enumerate() {
        if team.players.len() != 11 {
            return Err(format!("Team {} must have exactly 11 players", i + 1));
        }

        if team.bench_players.len() < 5 {
            return Err(format!("Team {} must have at least 5 players on the bench", i + 1));
        }
    }

    // Catch panics safely when simulating the game
    let safe_result = panic::catch_unwind(|| simulate_new_game(teams));

    match safe_result {
        Ok(inner_result) => inner_result,
        Err(_) => Err("Unexpected error while creating game (panic captured)".to_string()),
    }
}
