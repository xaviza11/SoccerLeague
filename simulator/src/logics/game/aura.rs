use crate::models::player::Player;

/// Applies the selected team auras directly to the players in place.
/// Each aura gives +3 to a related skill (capped at 99).
pub fn calculate_aura(auras: &Vec<String>, players: &mut Vec<Player>) {
    for player in players.iter_mut() {
        for aura in auras {
            match aura.as_str() {
                "Sharpshooters" => {
                    player.skills.shooting = (player.skills.shooting + 3).min(99);
                }
                "Playmakers" => {
                    player.skills.passing = (player.skills.passing + 3).min(99);
                }
                "Maestros" => {
                    player.skills.dribbling = (player.skills.dribbling + 3).min(99);
                }
                "Ironclads" => {
                    player.skills.defense = (player.skills.defense + 3).min(99);
                }
                "Powerhouses" => {
                    player.skills.physical = (player.skills.physical + 3).min(99);
                }
                "Cheetahs" => {
                    player.skills.speed = (player.skills.speed + 3).min(99);
                }
                "Immortals" => {
                    player.skills.stamina = (player.skills.stamina + 3).min(99);
                }
                "Visionaries" => {
                    player.skills.vision = (player.skills.vision + 3).min(99);
                }
                "Longballers" => {
                    player.skills.crossing = (player.skills.crossing + 3).min(99);
                }
                "Snipers" => {
                    player.skills.finishing = (player.skills.finishing + 3).min(99);
                }
                "Brawlers" => {
                    player.skills.aggression = (player.skills.aggression + 3).min(99);
                }
                "Controllers" => {
                    player.skills.control = (player.skills.control + 3).min(99);
                }
                _ => {} // ignore invalid auras (already validated elsewhere)
            }
        }
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};

    fn make_base_player() -> Player {
        Player {
            name: "Test Player".to_string(),
            country: "Testland".to_string(),
            position: "Midfielder".to_string(),
            current_position: "Midfielder".to_string(),
            original_position: "Midfielder".to_string(),
            age: 25,
            is_active: true,
            injured_until: "".to_string(),
            max_skill_level: 90,
            retirement_age: 35,
            card: "None".to_string(),
            offensive_instructions: vec![],
            defensive_instructions: vec![],
            height_cm: 180,
            skills: Skills {
                shooting: 70,
                passing: 70,
                dribbling: 70,
                defense: 70,
                physical: 70,
                speed: 70,
                stamina: 70,
                vision: 70,
                crossing: 70,
                finishing: 70,
                aggression: 70,
                composure: 70,
                control: 70,
                intuition: 70,
                handling: 70,
                kicking: 70,
                reflexes: 70,
            },
        }
    }

    #[test]
    fn test_single_aura_upgrade() {
        let mut players = vec![make_base_player()];
        let auras = vec!["Sharpshooters".to_string()];

        calculate_aura(&auras, &mut players);

        assert_eq!(players[0].skills.shooting, 73);
        assert_eq!(players[0].skills.passing, 70);
    }

    #[test]
    fn test_multiple_auras_stack() {
        let mut players = vec![make_base_player()];
        let auras = vec!["Sharpshooters".to_string(), "Playmakers".to_string()];

        calculate_aura(&auras, &mut players);

        assert_eq!(players[0].skills.shooting, 73);
        assert_eq!(players[0].skills.passing, 73);
    }

    #[test]
    fn test_no_auras_no_change() {
        let mut players = vec![make_base_player()];
        let auras: Vec<String> = vec![];

        calculate_aura(&auras, &mut players);

        assert_eq!(players[0].skills.shooting, 70);
        assert_eq!(players[0].skills.passing, 70);
    }

    #[test]
    fn test_invalid_aura_ignored() {
        let mut players = vec![make_base_player()];
        let auras = vec!["InvalidAura".to_string()];

        calculate_aura(&auras, &mut players);

        assert_eq!(players[0].skills.shooting, 70);
        assert_eq!(players[0].skills.passing, 70);
    }

    #[test]
    fn test_skill_cap_at_99() {
        let mut player = make_base_player();
        player.skills.speed = 98;
        let mut players = vec![player];
        let auras = vec!["Cheetahs".to_string()];

        calculate_aura(&auras, &mut players);

        assert_eq!(players[0].skills.speed, 99); // capped
    }
}

