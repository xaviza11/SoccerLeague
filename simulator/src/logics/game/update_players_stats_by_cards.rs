use crate::models::player::Player;

pub fn update_players_stats_by_cards(players: &mut Vec<Player>) {
    for player in players.iter_mut() {
        match player.card.to_lowercase().as_str() {
            // Outfield cards (one card = one stat)
            "cheetah"       => player.skills.speed += 5,
            "sniper"        => player.skills.shooting += 5,
            "commandant"    => player.skills.passing += 5,
            "magician"      => player.skills.dribbling += 5,
            "wall"          => player.skills.defense += 5,
            "titan"         => player.skills.physical += 5,
            "horse"         => player.skills.stamina += 5,
            "visionary"     => player.skills.vision += 5,
            "quarterback"   => player.skills.crossing += 5,
            "killer"        => player.skills.finishing += 5,
            "fighter"       => player.skills.aggression += 5,
            "lion"          => player.skills.composure += 5,
            "general"       => player.skills.control += 5,

            // Goalkeeper cards
            "magnet"        => player.skills.handling += 5,
            "fasthands"     => player.skills.reflexes += 5,
            "guardian"      => player.skills.intuition += 5,
            "rocket"        => player.skills.kicking += 5,

            // NONE or unrecognized -> do nothing
            _               => {}
        }

        // Clamp stats to max 99
        clamp_skills(&mut player.skills);
    }
}

/// Helper: clamp all skills to 99
fn clamp_skills(skills: &mut crate::models::player::Skills) {
    skills.shooting = skills.shooting.min(99);
    skills.passing = skills.passing.min(99);
    skills.dribbling = skills.dribbling.min(99);
    skills.defense = skills.defense.min(99);
    skills.physical = skills.physical.min(99);
    skills.speed = skills.speed.min(99);
    skills.stamina = skills.stamina.min(99);
    skills.vision = skills.vision.min(99);
    skills.crossing = skills.crossing.min(99);
    skills.finishing = skills.finishing.min(99);
    skills.aggression = skills.aggression.min(99);
    skills.composure = skills.composure.min(99);
    skills.control = skills.control.min(99);
    skills.intuition = skills.intuition.min(99);
    skills.handling = skills.handling.min(99);
    skills.kicking = skills.kicking.min(99);
    skills.reflexes = skills.reflexes.min(99);
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::{Player, Skills};

    fn make_player(name: &str, position: &str, card: &str, base_skill: u8) -> Player {
        Player {
            name: name.to_string(),
            country: "Testland".to_string(),
            position: position.to_string(),
            current_position: position.to_string(),
            original_position: position.to_string(),
            age: 25,
            is_active: true,
            injured_until: "".to_string(),
            max_skill_level: 90,
            retirement_age: 35,
            skills: Skills {
                shooting: base_skill,
                passing: base_skill,
                dribbling: base_skill,
                defense: base_skill,
                physical: base_skill,
                speed: base_skill,
                stamina: base_skill,
                vision: base_skill,
                crossing: base_skill,
                finishing: base_skill,
                aggression: base_skill,
                composure: base_skill,
                control: base_skill,
                intuition: base_skill,
                handling: base_skill,
                kicking: base_skill,
                reflexes: base_skill,
            },
            card: card.to_string(),
            offensive_instructions: vec![],
            defensive_instructions: vec![],
            height_cm: 180,
        }
    }

    #[test]
    fn test_cheetah_increases_speed() {
        let mut players = vec![make_player("John", "Forward", "Cheetah", 80)];
        update_players_stats_by_cards(&mut players);

        let p = &players[0];
        assert_eq!(p.skills.speed, 85);
        assert_eq!(p.skills.shooting, 80); // unchanged
    }

    #[test]
    fn test_goalkeeper_card_increases_correct_stat() {
        let mut players = vec![make_player("Sam", "Goalkeeper", "Magnet", 70)];
        update_players_stats_by_cards(&mut players);

        let p = &players[0];
        assert_eq!(p.skills.handling, 75);
        assert_eq!(p.skills.reflexes, 70);
    }

    #[test]
    fn test_none_card_does_nothing() {
        let mut players = vec![make_player("Tom", "Defender", "NONE", 82)];
        update_players_stats_by_cards(&mut players);

        let p = &players[0];
        assert_eq!(p.skills.defense, 82);
        assert_eq!(p.skills.physical, 82);
        assert_eq!(p.skills.speed, 82);
    }

    #[test]
    fn test_clamping_at_99() {
        let mut players = vec![make_player("Leo", "Forward", "Killer", 97)];
        update_players_stats_by_cards(&mut players);

        let p = &players[0];
        assert_eq!(p.skills.finishing, 99); // not 102
    }
}



