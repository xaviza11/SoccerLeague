use crate::models::game::{ Game, GameResult, Data };
use crate::validators::game::lineup::validate_lineup;
use crate::validators::game::substitutions::validate_substitutions;
use crate::validators::player::card::validate_cards_for_players;
use crate::validators::player::instructions::validate_instructions;
use crate::validators::game::aura::validate_team_aura;

use crate::logics::game::update_players_stats_by_cards::update_players_stats_by_cards;
use crate::logics::game::chemistry_calculator::calculate_chemistry;
use crate::logics::game::aura::calculate_aura;
use crate::logics::game::pass_and_possession::select_initial_possession;
use crate::logics::game::pass_and_possession::select_half_part_possession;
use crate::logics::game::action_selector::select_action;

use actix_web::{ error, Error };

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
        },
    };

    // Log that the data has been loaded successfully
    push_game_log(255, "Data loaded", &mut result);

    // Validate the game data (lineups, etc.)
    validate_data(&mut result, &game)?;

    // Update the players stats before to start the game..
    update_player_stats(&mut result, &mut game);

    // Start game
    main_loop(&mut result, &mut game);

    // If validation succeeds, return the initialized GameResult
    Ok(result)
}

pub fn validate_data(result: &mut GameResult, game: &Game) -> Result<(), Error> {
    // Log the start of validation for debugging/tracking purposes
    push_game_log(255, "Validating team data", result);

    // Extract the lineup for Team A and Team B as Vec<String> of positions
    let lineup_a: Vec<String> = game.teams[0].players
        .iter()
        .map(|p| p.position.clone())
        .collect();
    let lineup_b: Vec<String> = game.teams[1].players
        .iter()
        .map(|p| p.position.clone())
        .collect();

    // Validate lineups.
    validate_lineup(lineup_a).map_err(|err|
        error::ErrorBadRequest(format!("Team A lineup invalid: {}", err))
    )?;
    validate_lineup(lineup_b).map_err(|err|
        error::ErrorBadRequest(format!("Team B lineup invalid: {}", err))
    )?;

    // Validate substitutions
    validate_substitutions(&game.teams[0].substitutions).map_err(|err|
        error::ErrorBadRequest(format!("Team A substitutions invalid: {}", err))
    )?;
    validate_substitutions(&game.teams[1].substitutions).map_err(|err|
        error::ErrorBadRequest(format!("Team B substitutions invalid: {}", err))
    )?;

    //validate instructions
    validate_instructions(&game.teams[0].players).map_err(|err|
        error::ErrorBadRequest(format!("Team A player instructions invalid: {}", err))
    )?;
    validate_instructions(&game.teams[1].players).map_err(|err|
        error::ErrorBadRequest(format!("Team B player instructions invalid: {}", err))
    )?;
    validate_instructions(&game.teams[0].bench_players).map_err(|err|
        error::ErrorBadRequest(format!("Team A bench_player instructions invalid: {}", err))
    )?;
    validate_instructions(&game.teams[1].bench_players).map_err(|err|
        error::ErrorBadRequest(format!("Team B bench_player instructions invalid: {}", err))
    )?;

    // Validate cards
    validate_cards_for_players(&game.teams[0].players).map_err(|err|
        error::ErrorBadRequest(format!("Team A player cards invalid: {}", err))
    )?;
    validate_cards_for_players(&game.teams[1].players).map_err(|err|
        error::ErrorBadRequest(format!("Team B player cards invalid: {}", err))
    )?;
    validate_cards_for_players(&game.teams[0].bench_players).map_err(|err|
        error::ErrorBadRequest(format!("Team A bench_players cards invalid: {}", err))
    )?;
    validate_cards_for_players(&game.teams[1].bench_players).map_err(|err|
        error::ErrorBadRequest(format!("Team A bench_players cards invalid: {}", err))
    )?;

    //validate aura
    validate_team_aura(&game.teams[0].aura).map_err(|err|
        error::ErrorBadRequest(format!("Team A auras invalid: {}", err))
    )?;
    validate_team_aura(&game.teams[1].aura).map_err(|err|
        error::ErrorBadRequest(format!("Team B auras invalid: {}", err))
    )?;

    // Log success if both lineups are valid
    push_game_log(255, "Team data validation success", result);

    // Return Ok if validation passes, otherwise the error was already propagated
    Ok(())
}

pub fn update_player_stats(result: &mut GameResult, game: &mut Game) {
    // 1. Log start
    push_game_log(255, "Starting to update the player stats", result);

    // 2. Apply player card bonuses (+5 in a single stat)
    update_players_stats_by_cards(&mut game.teams[0].players);
    update_players_stats_by_cards(&mut game.teams[1].players);
    update_players_stats_by_cards(&mut game.teams[0].bench_players);
    update_players_stats_by_cards(&mut game.teams[1].bench_players);

    // 3. Apply team chemistry bonuses (+10 in each stat max)
    calculate_chemistry(&mut game.teams[0].players);
    calculate_chemistry(&mut game.teams[1].players);

    // 4. Apply aura bonuses (+3 in one stat)
    calculate_aura(&game.teams[0].aura, &mut game.teams[0].players);
    calculate_aura(&game.teams[1].aura, &mut game.teams[1].players);

    push_game_log(255, "Players stats are updated", result);
}

pub fn main_loop(result: &mut GameResult, game: &mut Game) {
    let steps_per_minute = 5;
    let mut current_minute = 0;
    let mut last_pass_player = [-1, -11];
    let mut substitutions = [-3, -3];
    let mut player_possession = select_initial_possession();

    for i in 0..91 * steps_per_minute {
        // Start the game
        if i % steps_per_minute == 0 {
            // Print game start
            if current_minute == 0 {
                let player_name =
                    &game.teams[player_possession[0] as usize].players
                        [player_possession[1] as usize].name;
                let team_name = &game.teams[player_possession[0] as usize].name;
                push_game_log(
                    current_minute,
                    &format!(
                        "Kickoff! The game begins. Possession: {} (Team: {})",
                        player_name,
                        team_name
                    ),
                    result
                );
            }

            // Print the second part on the logs
            if current_minute == 45 {
                player_possession = select_half_part_possession();
                let player_name =
                    &game.teams[player_possession[0] as usize].players
                        [player_possession[1] as usize].name;
                let team_name = &game.teams[player_possession[0] as usize].name;
                push_game_log(
                    current_minute,
                    &format!(
                        "Second half begins! Possession: {} (Team: {})",
                        player_name,
                        team_name
                    ),
                    result
                );
            }
            action_mechanic(game, &mut player_possession, result, current_minute);
            current_minute += 1;
        }
    }
}

pub fn action_mechanic(
    game: &mut Game,
    player_possession: &mut [u8; 2],
    result: &mut GameResult,
    current_minute: u8
) {
    let team_index = player_possession[0] as usize;
    let player_index = player_possession[1] as usize;

    select_action(game.teams[team_index].players[player_index].clone(), "NONE");
    println!("{:?}", current_minute);
}

pub fn push_game_log(minute: u8, log: &str, game_result: &mut GameResult) {
    let formatted_log = format!("{}': {}", minute, log);
    game_result.logs.push(formatted_log);
}
