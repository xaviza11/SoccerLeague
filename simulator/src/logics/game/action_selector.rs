use std::fs;
use serde_json::Value;
use crate::models::game::Game;
use rand::Rng;

// This function load the file whit the probabilities for chose one action
pub fn select_action(game: &mut Game, last_action: &str, team_index: usize, player_index: usize) {
    let player = game.teams[team_index].players[player_index].clone();
    let position = player.position;

    // Construct the file path dynamically
    let file_path = format!("src/data/positions/{}.json", position.to_lowercase());

    // Read the JSON file
    let data = fs
        ::read_to_string(&file_path)
        .expect(&format!("Failed to read file for position: {}", position));

    // Parse JSON into a serde_json::Value
    let mut json: Value = serde_json::from_str(&data).expect("Failed to parse JSON");

    adjust_probabilities_for_opponents(game, team_index, &position, &mut json);
    apply_offensive_instructions(&mut json, &game.teams[team_index].players[player_index].offensive_instructions, 0.2);

    let action = choose_action(&json);

    // Example: get probability for a specific action
    //if let Some(prob_tackle) = json.get("pass").and_then(|v| v.as_f64()) {
    //println!("Tackle probability: {}", prob_tackle);
    //}
}

fn value_from_f64(n: f64) -> Value {
    // Insert integer values as integers when possible (keeps json tidy)
    if (n - n.round()).abs() < std::f64::EPSILON {
        Value::from(n as i64)
    } else {
        Value::from(n)
    }
}

// This function adjust the probabilities when the opponents are 0 change advance for dribble 
pub fn adjust_probabilities_for_opponents(
    game: &Game,
    team_index: usize,
    position: &str,
    json: &mut Value
) {
    // Determine the opposing team index (0 ↔ 1)
    let opponent_index = if team_index == 0 { 1 } else { 0 };

    // Check if any opponent players share this position
    let has_opponent_same_position = game.teams[opponent_index].players
        .iter()
        .any(|p| p.position.eq_ignore_ascii_case(position));

    // If there are opponents with the same position, do nothing
    if has_opponent_same_position {
        return;
    }

    // Otherwise, transfer the `dribble` probability into `advance`
    if let Some(map) = json.as_object_mut() {
        // Extract dribble as f64 (if missing -> 0.0)
        let dribble_val = map
            .remove("dribble")
            .and_then(|v| v.as_f64())
            .unwrap_or(0.0);

        // Extract advance (if missing -> 0.0)
        let advance_val = map
            .remove("advance")
            .and_then(|v| v.as_f64())
            .unwrap_or(0.0);

        // New advance is sum of previous advance + dribble
        let new_advance = advance_val + dribble_val;

        // Insert updated values: dribble -> 0, advance -> new_advance
        map.insert("dribble".to_string(), value_from_f64(0.0));
        map.insert("advance".to_string(), value_from_f64(new_advance));
    }
}

// This function Increase the probabilities of 0-3 actions using the instructions 
pub fn apply_offensive_instructions(
    json: &mut Value,
    offensive_instructions: &[String],
    bonus_percent: f64
) {
    if let Some(map) = json.as_object_mut() {
        for instruction in offensive_instructions {
            let key = instruction.to_lowercase();
            if let Some(value) = map.get_mut(&key) {
                if let Some(prob) = value.as_f64() {
                    let new_prob = prob * (1.0 + bonus_percent);
                    *value = Value::from(new_prob as i64);
                    println!("Increased '{}' probability from {:.1} → {:.1}", key, prob, new_prob);
                }
            }
        }
    }
}

// This function chose the action
pub fn choose_action(json: &Value) -> Option<String> {
    if let Some(map) = json.as_object() {
        // Collect actions and their probabilities (skip zero/negative values)
        let mut actions = Vec::new();
        let mut total_weight = 0.0;

        for (action, val) in map {
            if let Some(weight) = val.as_f64() {
                if weight > 0.0 {
                    actions.push((action.clone(), weight));
                    total_weight += weight;
                }
            }
        }

        if actions.is_empty() {
            return None; // no possible actions
        }

        // Generate a random number in [0, total_weight)
        let mut rng = rand::thread_rng();
        let mut roll = rng.gen_range(0.0..total_weight);

        // Pick the action based on cumulative weights
        for (action, weight) in actions {
            if roll < weight {
                return Some(action);
            }
            roll -= weight;
        }
    }
    None
}