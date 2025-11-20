use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum InjuryType {
    Soft,
    Hard,
}

#[derive(Deserialize, Serialize, Debug, Clone, Default)]
pub struct TeamStats {
    pub red_cards: Vec<u8>,
    pub yellow_cards: Vec<u8>,
    pub scorers: Vec<u8>,
    pub injuries: Vec<(u8, InjuryType)>,
    pub assistants: Vec<u8>,
}

impl TeamStats {
    pub fn add_card(&mut self, card_type: &str, player_index: u8) {
        match card_type {
            "yellow" => self.yellow_cards.push(player_index),
            "red" => self.red_cards.push(player_index),
            _ => {}
        }
    }

    pub fn add_scorer(&mut self, scorer: u8) {
        self.scorers.push(scorer);
    }
    
    pub fn add_injury(&mut self, player_index: u8, intensity: InjuryType) {
        self.injuries.push((player_index, intensity));
    }

    pub fn add_assistant(&mut self, player_index: u8) {
        self.assistants.push(player_index);
    }
}
