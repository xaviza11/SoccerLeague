use std::fs;
use serde_json::from_str;
use crate::models::player::actions::Actions;
use crate::models::game::team::Team;
use crate::models::game::game_result::GameResult;
use crate::models::game::log::Log;
use crate::utils::generate_random_number::generate_number_by_range;

pub struct TestGame {
    pub teams: [Team; 2],
    pub game_result: GameResult,
    pub logs: Vec<Log>,
    pub ball_possession: [u8; 2],
    pub minute: u8,
    pub action: i32,
}

#[cfg(test)]
mod tests {
    use crate::models::player::position::Position;
    use crate::models::player::countries::Country;
    use crate::models::player::player::Player;
    use crate::models::player::skills::Skills;
    use crate::models::player::status::Status;
    use crate::models::player::instructions::Instructions;
    use crate::models::player::stats::Stats;
    use crate::models::game::team::Team;
    use crate::models::game::game_result::GameResult;
    use crate::models::game::log::Log;
    use crate::models::player::actions::Actions;

    // Helper to create a dummy player
    fn create_dummy_player(number: u8, position: Position, country: Country) -> Player {
        Player {
            name: format!("Player {}", number),
            country: country,
            position: position.clone(),
            current_position: position.clone(),
            original_position: position.clone(),
            max_skill_level: 100,
            height_cm: 180,
            card: None,
            number,
            skills: Skills::generate_skills(&position, 85.0),
            status: Status::generate_default_status(),
            instructions: Instructions::generate_empty_instructions(),
            stats: Stats::generate_default_status(),
        }
    }

    // Helper to create a dummy team
    fn create_dummy_team() -> Team {
        let players = vec![
            create_dummy_player(0, Position::Goalkeeper, Country::Spain),
            create_dummy_player(1, Position::Defender, Country::Spain),
            create_dummy_player(2, Position::Defender, Country::Spain),
            create_dummy_player(3, Position::Defender, Country::Spain),
            create_dummy_player(4, Position::Left_Back, Country::Spain),
            create_dummy_player(5, Position::Right_Back, Country::Spain),
            create_dummy_player(6, Position::Midfielder, Country::Spain),
            create_dummy_player(7, Position::Left_Midfield, Country::Spain),
            create_dummy_player(8, Position::Right_Midfield, Country::Spain),
            create_dummy_player(9, Position::Attacking_Midfield, Country::Spain),
            create_dummy_player(10, Position::Striker, Country::Spain)
        ];

        Team {
            name: "Dummy Team".to_string(),
            players,
            aura: ["NONE".to_string(), "NONE".to_string(), "NONE".to_string()],
            bench_players: vec![],
            player_name: "Dummy".to_string(),
        }
    }

    // Create a test game
    fn create_test_game() -> ([Team; 2], GameResult, Vec<Log>, [u8; 2], [u8; 2]) {
        let teams = [create_dummy_team(), create_dummy_team()];
        let game_result = GameResult { score: [0, 0] };
        let logs: Vec<Log> = vec![];
        let ball_possession = [0, 10]; // striker will shoot
        let last_pass_player = [0, 9]; // dummy last passer

        (teams, game_result, logs, ball_possession, last_pass_player)
    }

    #[test]
    fn test_cross_various_outcomes() {
        let mut successes = 0;
        let mut failures = 0;

        let attempts = 1000;

        for _ in 0..attempts {
            let (mut teams, _game_result, mut logs, mut ball_possession, mut last_pass_player) =
                create_test_game();

            let starting_team = ball_possession[0];
            let starting_player = ball_possession[1];

            let result = Actions::cross(&mut teams, &mut ball_possession, &mut logs, 10);

            // cross() always returns bool
            assert!(result == true || result == false);

            // Count logs
            for log in &logs {
                match log.description.as_str() {
                    "success.cross" => {
                        successes += 1;
                    }
                    "failed.cross" => {
                        failures += 1;
                    }
                    _ => {}
                }
            }

            // crossing does NOT change possession
            assert_eq!(
                ball_possession[0],
                starting_team,
                "Cross changed team possession unexpectedly!"
            );
            assert_eq!(
                ball_possession[1],
                starting_player,
                "Cross changed player possession unexpectedly!"
            );
        }

        println!(
            "Cross results over {} attempts: successes={}, failures={}",
            attempts,
            successes,
            failures
        );

        // Ensure both outcomes happened
        assert!(successes > 0, "No successful crosses recorded");
        assert!(failures > 0, "No failed crosses recorded");

        // Probability sanity checks – tune if needed
        assert!(successes > 600, "Cross success rate too hight (expected > 60%)");
        assert!(failures > 150, "Cross failure rate too low (expected > 15%)");
    }
}
