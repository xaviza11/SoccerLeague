use crate::models::game::{Game, GameResult};
use crate::validators::game::lineup::validate_lineup;
use actix_web::{error, Error};

pub fn simulate_game(game: Game) -> Result<GameResult, Error> {
    // Initialize the GameResult struct with default values
    let mut result = GameResult {
        score: (0, 0),
        logs: Vec::new(),
        cards_player_a: Vec::new(),
        cards_player_b: Vec::new(),
        scorers_player_a: Vec::new(),
        scorers_player_b: Vec::new(),
        injuries_player_a: Vec::new(),
        injuries_player_b: Vec::new(),
        assistants_player_a: Vec::new(),
        assistants_player_b: Vec::new(),
    };

    // Log that the data has been loaded successfully
    push_game_log(255, "Data loaded", &mut result);

    // Validate the game data (lineups, etc.)
    validate_data(&mut result, &game)?;

    // If validation succeeds, return the initialized GameResult
    Ok(result)
}


pub fn validate_data(result: &mut GameResult, game: &Game) -> Result<(), Error> {
    // Log the start of validation for debugging/tracking purposes
    push_game_log(255, "Validating team data", result);

    // Extract the lineup for Team A and Team B as Vec<String> of positions
    let lineup_a: Vec<String> = game.team_a.players.iter().map(|p| p.position.clone()).collect();
    let lineup_b: Vec<String> = game.team_b.players.iter().map(|p| p.position.clone()).collect();

    // Validate lineups.
    validate_lineup(lineup_a).map_err(|err| error::ErrorBadRequest(format!("Team A lineup invalid: {}", err)))?;
    validate_lineup(lineup_b).map_err(|err| error::ErrorBadRequest(format!("Team B lineup invalid: {}", err)))?;

    // Log success if both lineups are valid
    push_game_log(255, "Team data validation success", result);

    // Return Ok if validation passes, otherwise the error was already propagated
    Ok(())
}



pub fn main_loop() {
    // let steps_per_minute = 5 - 9;
    // let current_minute = 0;
    // let last_pass_player = [0-1, 0-11];
    // let substitutions = [0-3, 0-3];

    // Check substitutions

    // select random player (central) for start half part
    // action_mechanic()
    // update game state
    // update players status if needed
    // repeat until end of half and restart for second half
}

pub fn action_mechanic() {
    // use the field map, the position on the map of the player and the number of players of the other team for determine action type 
    // (pass, shoot, dribble, advance, 
    // long_pass, cross, penalty, corner,
    // control, Free kick, Goal kick
    // offside)
    // (Pase, Disparo, Regate, Avanzar, 
    // Pase largo, Centro, Penalti, Córner,
    // control, Tiro libre, Saque de meta
    // Fuera de juego)
    // calculate success based on player stats and random factors
    // update game state based on action outcome if needed
}

pub fn push_game_log(minute: u8, log: &str, game_result: &mut GameResult) {
    let formatted_log = format!("{}': {}", minute, log);
    game_result.logs.push(formatted_log);
}
