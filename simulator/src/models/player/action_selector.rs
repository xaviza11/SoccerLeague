use crate::models::player::position::Position;
use crate::utils::generate_random_number::generate_number_by_range;
use crate::models::player::actions::Actions;
use crate::models::game::game_result::GameResult;
use crate::models::game::team::Team;
use crate::models::player::instructions::OffensiveInstruction;
use crate::models::game::log::Log;

pub struct ActionSelector;

#[derive(Debug, Clone, Copy)]
pub struct ActionProbabilities {
    pub shoot: u32,
    pub pass: u32,
    pub dribble: u32,
    pub advance: u32,
    pub long_pass: u32,
    pub cross: u32,
}

// Esta función convierte tu array de tuplas en ActionProbabilities
fn tuple_to_probs(actions: &[(&str, u8)]) -> ActionProbabilities {
    let mut probs = ActionProbabilities {
        shoot: 0,
        pass: 0,
        dribble: 0,
        advance: 0,
        long_pass: 0,
        cross: 0,
    };
    for (name, val) in actions.iter() {
        match *name {
            "shoot" => probs.shoot = *val as u32,
            "pass" => probs.pass = *val as u32,
            "dribble" => probs.dribble = *val as u32,
            "advance" => probs.advance = *val as u32,
            "long_pass" => probs.long_pass = *val as u32,
            "cross" => probs.cross = *val as u32,
            _ => {}
        }
    }
    probs
}

// Cada módulo de posición define esto:
// pub const ACTIONS: &[(&str, u8)] = &[("shoot",25),("pass",40), ...];

impl Position {
    pub fn actions(&self) -> ActionProbabilities {
        match self {
            Position::Goalkeeper => tuple_to_probs(crate::logics::player::actions::goalkeeper::ACTIONS),
            Position::Defender => tuple_to_probs(crate::logics::player::actions::defender::ACTIONS),
            Position::Left_Back => tuple_to_probs(crate::logics::player::actions::left_back::ACTIONS),
            Position::Right_Back => tuple_to_probs(crate::logics::player::actions::right_back::ACTIONS),
            Position::Defensive_Midfield => tuple_to_probs(crate::logics::player::actions::defensive_midfield::ACTIONS),
            Position::Midfielder => tuple_to_probs(crate::logics::player::actions::midfielder::ACTIONS),
            Position::Left_Midfield => tuple_to_probs(crate::logics::player::actions::left_midfield::ACTIONS),
            Position::Right_Midfield => tuple_to_probs(crate::logics::player::actions::right_midfield::ACTIONS),
            Position::Attacking_Midfield => tuple_to_probs(crate::logics::player::actions::attacking_midfield::ACTIONS),
            Position::Left_Wing => tuple_to_probs(crate::logics::player::actions::left_wing::ACTIONS),
            Position::Right_Wing => tuple_to_probs(crate::logics::player::actions::right_wing::ACTIONS),
            Position::Striker => tuple_to_probs(crate::logics::player::actions::striker::ACTIONS),
        }
    }
}

impl ActionSelector {
    pub fn select_and_execute(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        last_pass_player: &mut [u8; 2],
        minutes: u8,
        logs: &mut Vec<Log>,
        game_result: &mut GameResult,
    ) {
        let team_idx = ball_possession[0] as usize;
        let player_idx = ball_possession[1] as usize;

        let player = &teams[team_idx].players[player_idx];
        let mut probs = player.current_position.actions();

        adjust_probabilities_if_alone(&mut probs, teams, team_idx as u8, player_idx as u8);
        adjust_probabilities_by_player_instructions(&mut probs, &player.instructions);

        let weights = [
            ("shoot", probs.shoot),
            ("pass", probs.pass),
            ("dribble", probs.dribble),
            ("advance", probs.advance),
            ("long_pass", probs.long_pass),
            ("cross", probs.cross),
        ];

        let total: u32 = weights.iter().map(|(_, w)| *w).sum();
        let roll = generate_number_by_range(0, (total - 1) as u8);

        let mut sum = 0;
        for (action, weight) in weights {
            sum += weight;
            if roll < sum as u8 {
                match action {
                    "shoot" => Actions::shoot(teams, ball_possession, last_pass_player, logs, minutes, game_result),
                    "pass" => Actions::pass(teams, ball_possession, last_pass_player, logs, minutes),
                    "dribble" => Actions::dribble(teams, ball_possession, logs, minutes),
                    "advance" => Actions::advance(teams, ball_possession),
                    "long_pass" => Actions::long_pass(teams, ball_possession, logs, minutes, last_pass_player),
                    "cross" => Actions::cross(teams, ball_possession, logs, minutes),
                    _ => unreachable!(),
                };
                return;
            }
        }
    }
}

fn adjust_probabilities_if_alone(
    probs: &mut ActionProbabilities,
    teams: &[Team; 2],
    current_team: u8,
    current_player: u8
) {
    let current_team = current_team as usize;
    let current_player = current_player as usize;

    let player = &teams[current_team].players[current_player];
    let pos = player.current_position.clone();

    let mut someone_else_in_position = false;

    for (team_index, team) in teams.iter().enumerate() {
        for (player_index, p) in team.players.iter().enumerate() {
            if team_index == current_team && player_index == current_player {
                continue;
            }
            if p.current_position == pos {
                someone_else_in_position = true;
                break;
            }
        }
        if someone_else_in_position { break; }
    }

    if !someone_else_in_position {
        std::mem::swap(&mut probs.dribble, &mut probs.advance);
    }
}

fn adjust_probabilities_by_player_instructions(
    probs: &mut ActionProbabilities,
    player_instructions: &crate::models::player::instructions::Instructions
) {
    for instr in player_instructions.offensive.iter().take(3) {
        match instr {
            OffensiveInstruction::Shoot => probs.shoot = probs.shoot.saturating_add(5),
            OffensiveInstruction::Pass => probs.pass = probs.pass.saturating_add(5),
            OffensiveInstruction::Dribble => probs.dribble = probs.dribble.saturating_add(5),
            OffensiveInstruction::Cross => probs.cross = probs.cross.saturating_add(5),
            OffensiveInstruction::LongBall => probs.long_pass = probs.long_pass.saturating_add(5),
        }
    }
}

