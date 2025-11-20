// src/models/player/player.rs
use serde::{ Deserialize, Serialize };

use crate::models::player::skills::Skills;
use crate::models::player::status::Status;
use crate::models::player::instructions::Instructions;
use crate::models::player::stats::Stats;
use crate::models::player::position::Position;
use crate::models::player::cards::Card;
use crate::models::player::countries::Country;

use crate::utils::generate_random_number::generate_number_by_range;

use crate::logics::player::generate_random_name::generate_random_name;
use crate::logics::player::generate_random_country::generate_random_country;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Player {
    pub name: String,
    pub country: Country,
    pub position: Position,
    pub current_position: Position,
    pub original_position: Position,
    pub max_skill_level: u8,
    pub height_cm: u8,
    pub card: Option<Card>,
    pub number: u8,

    pub skills: Skills,
    pub status: Status,
    pub instructions: Instructions,
    pub stats: Stats,
}

impl Player {
    pub fn create_new_player(position: Position, target_avr: f32) -> Self {
        let country = generate_random_country();
        let name = generate_random_name(&country);

        let skills = Skills::generate_skills(&position, target_avr);
        let status = Status::generate_default_status();
        let instructions = Instructions::generate_empty_instructions();
        let stats = Stats::generate_default_status();

        Self {
            name,
            country,
            current_position: position.clone(),
            original_position: position.clone(),
            position,
            max_skill_level: generate_number_by_range(80, 85),
            height_cm: generate_number_by_range(160, 210),
            card: None,
            number: 0,
            skills,
            stats,
            status,
            instructions,
        }
    }

    pub fn apply_card_boost(&mut self) {
        if let Some(card) = &self.card {
            card.apply_to(&mut self.skills);
        }
    }

     pub fn apply_country_bonus(&mut self, bonus: u8) {
        if bonus == 0 { return; }
        self.skills.shooting = self.skills.shooting.saturating_add(bonus);
        self.skills.passing = self.skills.passing.saturating_add(bonus);
        self.skills.dribbling = self.skills.dribbling.saturating_add(bonus);
        self.skills.defense = self.skills.defense.saturating_add(bonus);
        self.skills.physical = self.skills.physical.saturating_add(bonus);
        self.skills.speed = self.skills.speed.saturating_add(bonus);
        self.skills.stamina = self.skills.stamina.saturating_add(bonus);
        self.skills.vision = self.skills.vision.saturating_add(bonus);
        self.skills.crossing = self.skills.crossing.saturating_add(bonus);
        self.skills.finishing = self.skills.finishing.saturating_add(bonus);
        self.skills.aggression = self.skills.aggression.saturating_add(bonus);
        self.skills.composure = self.skills.composure.saturating_add(bonus);
        self.skills.control = self.skills.control.saturating_add(bonus);
        self.skills.handling = self.skills.handling.saturating_add(bonus);
        self.skills.reflexes = self.skills.reflexes.saturating_add(bonus);
        self.skills.intuition = self.skills.intuition.saturating_add(bonus);
        self.skills.kicking = self.skills.kicking.saturating_add(bonus);
    }
}
