use crate::models::game::{Team};

pub fn substitution(number_of_substitutions: u8, minute: u8, team: &mut Team) -> bool {
    // Reject if max substitutions reached
    if number_of_substitutions >= 3 {
        return false;
    }

    // Convert to usize for indexing
    let idx = number_of_substitutions as usize;

    // Bounds check for substitutions list
    if idx >= team.substitutions.len() {
        return false;
    }

    let substitution = &team.substitutions[idx];

    // Check minute match
    if minute != substitution.minute {
        return false;
    }

    let out_index = substitution.player_out as usize;
    let in_index = substitution.player_in as usize;

    // Check indices are within bounds
    if out_index >= team.players.len() || in_index >= team.bench_players.len() {
        return false;
    }

    // Perform substitution
    let mut player_in = team.bench_players.remove(in_index);
    let player_out = std::mem::replace(&mut team.players[out_index], player_in);

    // Adjust position if needed
    let player_in_ref = &mut team.players[out_index];
    if player_out.original_position != player_in_ref.original_position {
        player_in_ref.position = player_out.original_position.clone();
        player_in_ref.current_position = player_out.original_position.clone();
    }

    // Send player out to bench
    team.bench_players.push(player_out);

    true
}

#[derive(Debug, Clone)]
struct Player {
    name: String,
    original_position: String,
    position: String,
    current_position: String,
}

#[derive(Debug, Clone)]
struct Substitution {
    minute: u8,
    player_out: u8,
    player_in: u8,
}

#[derive(Debug, Clone)]
struct TestTeam {
    players: [Player; 11],
    bench_players: Vec<Player>,
    substitutions: Vec<Substitution>,
}

pub fn test_substitution(number_of_substitutions: u8, minute: u8, team: &mut TestTeam) -> bool {
    // Reject if max substitutions reached
    if number_of_substitutions >= 3 {
        return false;
    }

    let idx = number_of_substitutions as usize;

    if idx >= team.substitutions.len() {
        return false;
    }

    let substitution = &team.substitutions[idx];

    if minute != substitution.minute {
        return false;
    }

    let out_index = substitution.player_out as usize;
    let in_index = substitution.player_in as usize;

    if out_index >= team.players.len() || in_index >= team.bench_players.len() {
        return false;
    }

    let mut player_in = team.bench_players.remove(in_index);
    let player_out = std::mem::replace(&mut team.players[out_index], player_in);

    let player_in_ref = &mut team.players[out_index];
    if player_out.original_position != player_in_ref.original_position {
        player_in_ref.position = player_out.original_position.clone();
        player_in_ref.current_position = player_out.original_position.clone();
    }

    team.bench_players.push(player_out);

    true
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_team() -> TestTeam {
        let players = [
            Player { name: "Player1".to_string(), original_position: "GK".to_string(), position: "GK".to_string(), current_position: "GK".to_string() },
            Player { name: "Player2".to_string(), original_position: "DEF".to_string(), position: "DEF".to_string(), current_position: "DEF".to_string() },
            Player { name: "Player3".to_string(), original_position: "DEF".to_string(), position: "DEF".to_string(), current_position: "DEF".to_string() },
            Player { name: "Player4".to_string(), original_position: "MID".to_string(), position: "MID".to_string(), current_position: "MID".to_string() },
            Player { name: "Player5".to_string(), original_position: "MID".to_string(), position: "MID".to_string(), current_position: "MID".to_string() },
            Player { name: "Player6".to_string(), original_position: "MID".to_string(), position: "MID".to_string(), current_position: "MID".to_string() },
            Player { name: "Player7".to_string(), original_position: "FWD".to_string(), position: "FWD".to_string(), current_position: "FWD".to_string() },
            Player { name: "Player8".to_string(), original_position: "FWD".to_string(), position: "FWD".to_string(), current_position: "FWD".to_string() },
            Player { name: "Player9".to_string(), original_position: "FWD".to_string(), position: "FWD".to_string(), current_position: "FWD".to_string() },
            Player { name: "Player10".to_string(), original_position: "MID".to_string(), position: "MID".to_string(), current_position: "MID".to_string() },
            Player { name: "Player11".to_string(), original_position: "DEF".to_string(), position: "DEF".to_string(), current_position: "DEF".to_string() },
        ];

        let bench_players = vec![
            Player { name: "Bench1".to_string(), original_position: "DEF".to_string(), position: "DEF".to_string(), current_position: "DEF".to_string() },
            Player { name: "Bench2".to_string(), original_position: "MID".to_string(), position: "MID".to_string(), current_position: "MID".to_string() },
        ];

        let substitutions = vec![
            Substitution { minute: 30, player_out: 1, player_in: 0 },
            Substitution { minute: 60, player_out: 4, player_in: 1 },
        ];

        TestTeam {
            players,
            bench_players,
            substitutions,
        }
    }

    #[test]
    fn test_valid_substitution() {
        let mut team = create_test_team();
        let result = test_substitution(0, 30, &mut team);
        assert!(result);
        assert_eq!(team.players[1].name, "Bench1");
        assert!(team.bench_players.iter().any(|p| p.name == "Player2"));
    }

    #[test]
    fn test_max_substitutions_reached() {
        let mut team = create_test_team();
        let result = test_substitution(3, 30, &mut team);
        assert!(!result);
    }

    #[test]
    fn test_wrong_minute() {
        let mut team = create_test_team();
        let result = test_substitution(0, 31, &mut team);
        assert!(!result);
    }

    #[test]
    fn test_out_of_bounds_indices() {
        let mut team = create_test_team();
        // Modify substitution to be out-of-bounds
        team.substitutions[0].player_out = 20;
        let result = test_substitution(0, 30, &mut team);
        assert!(!result);

        team.substitutions[0].player_out = 1;
        team.substitutions[0].player_in = 5; // bench has only 2 players
        let result = test_substitution(0, 30, &mut team);
        assert!(!result);
    }

    #[test]
    fn test_position_adjustment() {
        let mut team = create_test_team();
        // Substitution where positions differ
        let result = test_substitution(0, 30, &mut team);
        assert!(result);
        let player_in = &team.players[1];
        assert_eq!(player_in.position, "DEF");
        assert_eq!(player_in.current_position, "DEF");
    }
}