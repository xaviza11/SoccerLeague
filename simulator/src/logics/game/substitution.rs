use crate::models::game::Team;

pub fn substitution(number_of_substitutions: u8, minute: u8, team: &mut Team) -> (bool, String) {
    // Reject if max substitutions reached
    if number_of_substitutions >= 3 {
        return (false, "Maximum substitutions reached".to_string());
    }

    let idx = number_of_substitutions as usize;

    if idx >= team.substitutions.len() {
        return (false, format!("No substitution scheduled for substitution number {}", number_of_substitutions));
    }

    let substitution = &team.substitutions[idx];

    if minute != substitution.minute {
        return (false, format!("Substitution not allowed at minute {}. Scheduled at minute {}", minute, substitution.minute));
    }

    let out_index = substitution.player_out as usize;
    let in_index = substitution.player_in as usize;

    if out_index >= team.players.len() {
        return (false, format!("Player out index {} is out of bounds", out_index));
    }

    if in_index >= team.bench_players.len() {
        return (false, format!("Player in index {} is out of bounds", in_index));
    }

    // Perform substitution
    let mut player_in = team.bench_players.remove(in_index);
    let player_out = std::mem::replace(&mut team.players[out_index], player_in);

    let player_in_ref = &mut team.players[out_index];
    if player_out.original_position != player_in_ref.original_position {
        player_in_ref.position = player_out.original_position.clone();
        player_in_ref.current_position = player_out.original_position.clone();
    }

    team.bench_players.push(player_out);

    (true, format!("Substitution successful: {} in, {} out", player_in_ref.name, team.bench_players.last().unwrap().name))
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

pub fn test_substitution(number_of_substitutions: u8, minute: u8, team: &mut TestTeam) -> (bool, String) {
    if number_of_substitutions >= 3 {
        return (false, "Maximum substitutions reached".to_string());
    }

    let idx = number_of_substitutions as usize;

    if idx >= team.substitutions.len() {
        return (false, format!("No substitution scheduled for substitution number {}", number_of_substitutions));
    }

    let substitution = &team.substitutions[idx];

    if minute != substitution.minute {
        return (false, format!("Substitution not allowed at minute {}. Scheduled at minute {}", minute, substitution.minute));
    }

    let out_index = substitution.player_out as usize;
    let in_index = substitution.player_in as usize;

    if out_index >= team.players.len() {
        return (false, format!("Player out index {} is out of bounds", out_index));
    }

    if in_index >= team.bench_players.len() {
        return (false, format!("Player in index {} is out of bounds", in_index));
    }

    let mut player_in = team.bench_players.remove(in_index);
    let player_out = std::mem::replace(&mut team.players[out_index], player_in);

    let player_in_ref = &mut team.players[out_index];
    if player_out.original_position != player_in_ref.original_position {
        player_in_ref.position = player_out.original_position.clone();
        player_in_ref.current_position = player_out.original_position.clone();
    }

    team.bench_players.push(player_out);

    (true, format!("Substitution successful: {} in, {} out", player_in_ref.name, team.bench_players.last().unwrap().name))
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
        let (result, msg) = test_substitution(0, 30, &mut team);
        assert!(result, "{}", msg);
        assert_eq!(team.players[1].name, "Bench1");
        assert!(team.bench_players.iter().any(|p| p.name == "Player2"));
    }

    #[test]
    fn test_max_substitutions_reached() {
        let mut team = create_test_team();
        let (result, msg) = test_substitution(3, 30, &mut team);
        assert!(!result, "{}", msg);
    }

    #[test]
    fn test_wrong_minute() {
        let mut team = create_test_team();
        let (result, msg) = test_substitution(0, 31, &mut team);
        assert!(!result, "{}", msg);
    }

    #[test]
    fn test_out_of_bounds_indices() {
        let mut team = create_test_team();
        team.substitutions[0].player_out = 20;
        let (result, msg) = test_substitution(0, 30, &mut team);
        assert!(!result, "{}", msg);

        team.substitutions[0].player_out = 1;
        team.substitutions[0].player_in = 5;
        let (result, msg) = test_substitution(0, 30, &mut team);
        assert!(!result, "{}", msg);
    }

    #[test]
    fn test_position_adjustment() {
        let mut team = create_test_team();
        let (result, msg) = test_substitution(0, 30, &mut team);
        assert!(result, "{}", msg);
        let player_in = &team.players[1];
        assert_eq!(player_in.position, "DEF");
        assert_eq!(player_in.current_position, "DEF");
    }
}
