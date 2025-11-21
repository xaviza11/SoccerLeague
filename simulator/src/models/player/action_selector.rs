use serde::Deserialize;
use std::fs;
use serde_json::from_str;

use crate::models::player::position::Position;
use crate::utils::generate_random_number::generate_number_by_range;
use crate::models::player::actions::Actions;
use crate::models::game::team::Team;
use crate::models::player::instructions::OffensiveInstruction;
use crate::models::game::log::Log;

pub struct ActionSelector;

#[derive(Debug, Deserialize)]
pub struct ActionProbabilities {
    pub shoot: u32,
    pub pass: u32,
    pub dribble: u32,
    pub advance: u32,
    pub long_pass: u32,
    pub cross: u32,
}

impl Position {
    pub fn file_name(&self) -> &'static str {
        match self {
            Position::Goalkeeper => "goalkeeper.json",
            Position::Defender => "defender.json",
            Position::Left_Back => "left_back.json",
            Position::Right_Back => "right_back.json",
            Position::Defensive_Midfield => "defensive_midfield.json",
            Position::Midfielder => "midfielder.json",
            Position::Left_Midfield => "left_midfield.json",
            Position::Right_Midfield => "right_midfield.json",
            Position::Attacking_Midfield => "attacking_midfield.json",
            Position::Left_Wing => "left_wing.json",
            Position::Right_Wing => "right_wing.json",
            Position::Striker => "striker.json",
        }
    }
}

impl ActionSelector {
    pub fn select_and_execute(teams: &mut [Team; 2], ball_possession: &mut [u8; 2], last_pass_player: &mut [u8; 2], minutes: u8, logs: &mut Vec<Log>) {
        let team_idx = ball_possession[0] as usize;
        let player_idx = ball_possession[1] as usize;

        // Read player's position BEFORE mutable borrow
        let pos = &teams[team_idx].players[player_idx].current_position;
        let file = pos.file_name();
        let path = format!("src/data/positions/{}", file);

        let raw = fs::read_to_string(&path).expect("Could not read position JSON {}");
        let mut p: ActionProbabilities = from_str(&raw).expect("Could not parse JSON");

        // Adjust probabilities (immutable access)
        adjust_probabilities_if_alone(&mut p, teams, team_idx as u8, player_idx as u8);
        let player_instructions = &teams[team_idx].players[player_idx].instructions;
        adjust_probabilities_by_player_instructions(&mut p, player_instructions);

        // Select action using weighted random
        let weights = [
            ("shoot", p.shoot),
            ("pass", p.pass),
            ("dribble", p.dribble),
            ("advance", p.advance),
            ("long_pass", p.long_pass),
            ("cross", p.cross),
        ];

        let total: u32 = weights.iter().map(|(_, w)| *w).sum();
        let roll = generate_number_by_range(0, (total - 1) as u8);

        let mut sum = 0;
        for (action, weight) in weights {
            sum += weight;
            if roll < sum as u8 {
                match action {
                    "shoot" => Actions::shoot(teams, ball_possession, last_pass_player, logs, minutes),
                    "pass" => Actions::pass(teams, ball_possession, last_pass_player, logs, minutes),
                    "dribble" => Actions::dribble(teams, ball_possession, logs, minutes),
                    "advance" => Actions::advance(teams, ball_possession),
                    "long_pass" => Actions::long_pass(teams, ball_possession, logs, minutes),
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
    current_player: u8,
) {
    let current_team = current_team as usize;
    let current_player = current_player as usize;

    let player = &teams[current_team].players[current_player];
    let pos = player.current_position.clone();

    // Check if any other player shares the same position
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
        if someone_else_in_position {
            break;
        }
    }

    // If no one else is in this position, swap dribble and advance probabilities
    if !someone_else_in_position {
        std::mem::swap(&mut probs.dribble, &mut probs.advance);
    }
}

fn adjust_probabilities_by_player_instructions(
    probs: &mut ActionProbabilities,
    player_instructions: &crate::models::player::instructions::Instructions,
) {
    for instr in player_instructions.offensive.iter().take(3) {
        match instr {
            OffensiveInstruction::Shoot => { probs.shoot = probs.shoot.saturating_add(5); }
            OffensiveInstruction::Pass => { probs.pass = probs.pass.saturating_add(5); }
            OffensiveInstruction::Dribble => { probs.dribble = probs.dribble.saturating_add(5); }
            OffensiveInstruction::Cross => { probs.cross = probs.cross.saturating_add(5); }
            OffensiveInstruction::LongBall => { probs.long_pass = probs.long_pass.saturating_add(5); }
        }
    }
}
