use serde::{ Deserialize, Serialize };
use crate::models::player::player::Player;
use crate::models::game::aura::Aura;
use std::collections::HashMap;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Team {
    pub name: String,
    pub player_name: String,
    pub players: Vec<Player>,
    pub bench_players: Vec<Player>,
    pub aura: [Aura; 3],
}

impl Team {
    pub fn apply_card_boosts(&mut self) {
        for player in &mut self.players {
            player.apply_card_boost();
        }
        for player in &mut self.bench_players {
            player.apply_card_boost();
        }
    }

    pub fn apply_auras(&mut self) {
        for aura_name in &self.aura {
            if let Some(aura) = Aura::from_name(aura_name.name.as_str()) {
                for player in &mut self.players {
                    aura.apply_to_player(&mut player.skills);
                }
                for bench in &mut self.bench_players {
                    aura.apply_to_player(&mut bench.skills);
                }
            }
        }
    }

    pub fn apply_country_chemical(&mut self) {
        let mut country_count: HashMap<String, usize> = HashMap::new();

        for p in &self.players {
            let key = format!("{:?}", p.country);
            *country_count.entry(key).or_insert(0) += 1;
        }

        for player in &mut self.players {
            let key = format!("{:?}", player.country);
            if let Some(count) = country_count.get(&key) {
                let bonus = Self::calculate_country_bonus(*count);
                if bonus > 0 {
                    player.apply_country_bonus(bonus);
                }
            }
        }
    }

    fn calculate_country_bonus(count: usize) -> u8 {
        match count {
            0 | 1 => 0,
            2 => 1,
            3 => 2,
            4 => 3,
            5 => 4,
            _ => 4,
        }
    }

    pub fn total_height(&self) -> u32 {
        self.players
            .iter()
            .map(|p| p.height_cm as u32)
            .sum()
    }

    pub fn average_height(&self) -> f32 {
        if self.players.is_empty() {
            return 0.0;
        }

        let total = self.total_height();
        (total as f32) / (self.players.len() as f32)
    }
}
