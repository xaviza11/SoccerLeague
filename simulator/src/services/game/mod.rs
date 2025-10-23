use crate::models::game::Game;
use crate::models::game::GameResult;

pub fn simulate_game(game: Game) -> Result<GameResult, &'static str>{
    // Create game  result object
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
    push_game_log(255, "Data loaded", &mut result);

    // Validate data
    push_game_log(255, "Validating team data", &mut result);
    let team_a_valid = validate_team_data();
    let team_b_valid = validate_team_data();
    if !team_a_valid || !team_b_valid {
        if (team_a_valid == false && team_b_valid == false) {return Err("Both teams data invalid");}
        if (team_b_valid == false) {return Err("team B data invalid");}
        if (team_a_valid == false) {return Err("team A data invalid");}
    }else {
        push_game_log(255, "team data success", &mut result);
    }
    push_game_log(255, "team data success", &mut result);
    push_game_log(255, "Validating player data", &mut result);
    push_game_log(255, "player data success", &mut result);
    // Apply improvements players stats (chemistry, cards, and instructions)
    // Simulate game using loop()
    // Return result
    return Ok(result);
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
    // use the field map, the position on the map off the player and the number off players of the other team for determine action type 
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

pub fn validate_team_data() -> bool {
    return false;

}

pub fn validate_player_data() -> bool {
    return true;

}

pub fn push_game_log(minute: u8, log: &str, game_result: &mut GameResult) {
    let formatted_log = format!("{}': {}", minute, log);
    game_result.logs.push(formatted_log);
}