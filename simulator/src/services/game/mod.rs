use crate::models::game::{Game, GameResult, Data};
use crate::validators::game::lineup::validate_lineup;
use crate::validators::game::substitutions::validate_substitutions;
use crate::validators::player::card::validate_cards_for_players;
use crate::validators::player::instructions::validate_instructions;
use crate::validators::game::aura::validate_team_aura;

use crate::logics::game::update_players_stats_by_cards::update_players_stats_by_cards;
use crate::logics::game::chemistry_calculator::calculate_chemistry;
use crate::logics::game::aura::calculate_aura;

use actix_web::{error, Error};

pub fn simulate_game(mut game: Game) -> Result<GameResult, Error> {
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
        data: Data {
             passes: 0,
             passes_suc: 0,
             shoots: 0,
             shoots_suc: 0,
             dribbles: 0,
             dribbles_suc: 0,
             advances: 0,
             advances_suc: 0,
             long_pass: 0,
             long_pass_suc: 0,
             cross: 0,
             cross_suc: 0,
             penalties: 0,
             penalties_goals: 0,
             corners: 0,
             corners_goals: 0,
             controls: 0,
             controls_suc: 0,
             free_kicks: 0,
             free_kicks_suc: 0,
             offsides: 0,
            }
        };

    // Log that the data has been loaded successfully
    push_game_log(255, "Data loaded", &mut result);

    // Validate the game data (lineups, etc.)
    validate_data(&mut result, &game)?;

    // ? Next step, create the update of the players stats, using aura, cards and instructions.
    update_player_stats(&mut result, &mut game);

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

    // Validate substitutions
    validate_substitutions(&game.team_a.substitutions).map_err(|err| error::ErrorBadRequest(format!("Team A substitutions invalid: {}", err)))?;
    validate_substitutions(&game.team_b.substitutions).map_err(|err| error::ErrorBadRequest(format!("Team B substitutions invalid: {}", err)))?;

    //validate instructions
    validate_instructions(&game.team_a.players).map_err(|err| error::ErrorBadRequest(format!("Team A player instructions invalid: {}", err)))?;
    validate_instructions(&game.team_b.players).map_err(|err| error::ErrorBadRequest(format!("Team B player instructions invalid: {}", err)))?;
    validate_instructions(&game.team_a.bench_players).map_err(|err| error::ErrorBadRequest(format!("Team A bench_player instructions invalid: {}", err)))?;
    validate_instructions(&game.team_b.bench_players).map_err(|err| error::ErrorBadRequest(format!("Team B bench_player instructions invalid: {}", err)))?;


    // Validate cards
    validate_cards_for_players(&game.team_a.players).map_err(|err| error::ErrorBadRequest(format!("Team A player cards invalid: {}", err)))?;
    validate_cards_for_players(&game.team_b.players).map_err(|err| error::ErrorBadRequest(format!("Team B player cards invalid: {}", err)))?;
    validate_cards_for_players(&game.team_a.bench_players).map_err(|err| error::ErrorBadRequest(format!("Team A bench_players cards invalid: {}", err)))?;
    validate_cards_for_players(&game.team_b.bench_players).map_err(|err| error::ErrorBadRequest(format!("Team A bench_players cards invalid: {}", err)))?;

    //validate aura
    validate_team_aura(&game.team_a.aura).map_err(|err| error::ErrorBadRequest(format!("Team A auras invalid: {}", err)))?;
    validate_team_aura(&game.team_b.aura).map_err(|err| error::ErrorBadRequest(format!("Team B auras invalid: {}", err)))?;

    // Log success if both lineups are valid
    push_game_log(255, "Team data validation success", result);

    // Return Ok if validation passes, otherwise the error was already propagated
    Ok(())
}

pub fn update_player_stats(result: &mut GameResult, game: &mut Game) {
    // 1. Log start
    push_game_log(255, "Starting to update the player stats", result);

    // 2. Apply player card bonuses (+5 in a single stat)
    update_players_stats_by_cards(&mut game.team_a.players);
    update_players_stats_by_cards(&mut game.team_b.players);
    update_players_stats_by_cards(&mut game.team_a.bench_players);
    update_players_stats_by_cards(&mut game.team_b.bench_players);

    // 3. Apply team chemistry bonuses (+10 in each stat max)
    calculate_chemistry(&mut game.team_a.players);
    calculate_chemistry(&mut game.team_b.players);

    // 4. Apply aura bonuses (+3 in one stat)
    calculate_aura(&game.team_a.aura, &mut game.team_a.players);
    calculate_aura(&game.team_b.aura, &mut game.team_b.players);

    push_game_log(255, "Players stats are updated", result);
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
