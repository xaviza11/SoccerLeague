use serde::{ Deserialize, Serialize };
use crate::models::game::game_result::GameResult;
use crate::models::game::log::Log;
use crate::models::game::team::Team;
use crate::models::player::position::Position;
use crate::models::player::action_selector::ActionSelector;

use crate::validators::game::lineup::validate_lineup;

use crate::utils::generate_random_number::generate_number_by_range;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Game {
    pub teams: [Team; 2],
    pub game_result: GameResult,
    pub logs: Vec<Log>,
    pub ball_possession: [u8; 2],
    pub minute: u8,
    pub action: i32,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct GameReturn {
    pub logs: Vec<Log>,
    pub game_result: Option<GameResult>,
}

impl Game {
    pub fn create_game(teams: [Team; 2]) -> Result<GameReturn, String> {
        // Validate lineup for each team
        for (i, team) in teams.iter().enumerate() {
            let positions: Vec<Position> = team.players
                .iter()
                .map(|p| p.position.clone())
                .collect();
            validate_lineup(positions).map_err(|e| format!("Team {} lineup error: {}", i + 1, e))?;
        }

        // Apply card boosts, auras, and country synergy
        let mut teams = teams; // make mutable
        for team in &mut teams {
            team.apply_card_boosts();
            team.apply_auras();
            team.apply_country_chemical(); // assuming you renamed apply_country_synergy
        }

        // Calculate average heights if needed
        let height_avr_0 = teams[0].average_height();
        let height_avr_1 = teams[1].average_height();

        //? Needs to create a system for define the kickers of the team

        // Create game
        let mut game = Self {
            teams,
            game_result: GameResult::create(),
            logs: Vec::new(),
            ball_possession: [0, 0],
            minute: 255,
            action: 0,
        };

        // Initial log
        game.logs.push(Log {
            minute: game.minute,
            player_name: "game".to_string(),
            description: "game.start".to_string(),
            player_number: 0,
            team_name: "game".to_string(),
        });

        game.play_full_match();

        Ok(GameReturn { logs: game.logs, game_result: Some(game.game_result) })
    }

    pub fn start_match(&mut self) {
        self.minute = 0;
        self.action = 0;

        let team_with_ball = 0 as u8;
        let random_player = generate_number_by_range(0, (self.teams[0].players.len() - 1) as u8);

        self.ball_possession = [team_with_ball, random_player];
        let last_pass_player = [team_with_ball, random_player];

        let current_player = &self.teams[0].players[self.ball_possession[1] as usize];

        let log = Log {
            minute: self.minute,
            player_name: current_player.name.clone(),
            description: format!("success.ball"),
            player_number: current_player.number,
            team_name: self.teams[0].name.clone(),
        };

        self.logs.push(log);
    }

    pub fn start_half_time(&mut self) {
        self.minute = 0;
        self.action = 0;

        let team_with_ball = 0 as u8;
        let random_player = generate_number_by_range(0, (self.teams[1].players.len() - 1) as u8);
        self.ball_possession = [team_with_ball, random_player];

        let current_player = &self.teams[1].players[self.ball_possession[1] as usize];

        let log = Log {
            minute: self.minute,
            player_name: current_player.name.clone(),
            description: format!("The second time starts — {} has the ball.", current_player.name),
            player_number: current_player.number,
            team_name: self.teams[1].name.clone(),
        };

        self.logs.push(log);
    }

    pub fn play_first_half(&mut self) {
        self.start_match();
        let mut last_pass_player = self.ball_possession.clone();

        for minute in 0..45 {
            self.minute = minute;

            for _ in 0..5 {
                // 5 actions per minute
                ActionSelector::select_and_execute(
                    &mut self.teams,
                    &mut self.ball_possession,
                    &mut last_pass_player,
                    self.minute,
                    &mut self.logs,
                    &mut self.game_result,
                );
                self.action += 1;
            }
        }
    }

    pub fn play_second_half(&mut self) {
        self.start_half_time();
        let mut last_pass_player = self.ball_possession.clone();

        for minute in 45..91 {
            self.minute = minute;

            for _ in 0..5 {
                // 5 actions per minute
                ActionSelector::select_and_execute(
                    &mut self.teams,
                    &mut self.ball_possession,
                    &mut last_pass_player,
                    self.minute,
                    &mut self.logs,
                    &mut self.game_result,
                );
                self.action += 1;
            }
        }
    }

    pub fn play_full_match(&mut self) {
        self.play_first_half();
        self.play_second_half();
    }
}
