use serde::{ Serialize, Deserialize };
use crate::models::player::skills::Skills;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub enum Card {
    Sniper, // shooting
    Commandant, // passing
    Magician, // dribbling
    Wall, // defense
    Titan, // physical
    Cheetah, // speed
    Horse, // stamina
    Visionary, // vision
    Quarterback, // crossing
    Killer, // finishing
    Fighter, // aggression
    Lion, // composure
    General, // control
    Magnet, // handling
    FastHands, // reflexes
    Guardian, // intuition
    Rocket,    // kicking
    NONE, // placeholder/no card
}

impl Card {
    pub fn apply_to(&self, skills: &mut Skills) {
        match self {
            Card::Sniper => {
                skills.shooting += 5;
            }
            Card::Commandant => {
                skills.passing += 5;
            }
            Card::Magician => {
                skills.dribbling += 5;
            }
            Card::Wall => {
                skills.defense += 5;
            }
            Card::Titan => {
                skills.physical += 5;
            }
            Card::Cheetah => {
                skills.speed += 5;
            }
            Card::Horse => {
                skills.stamina += 5;
            }
            Card::Visionary => {
                skills.vision += 5;
            }
            Card::Quarterback => {
                skills.crossing += 5;
            }
            Card::Killer => {
                skills.finishing += 5;
            }
            Card::Fighter => {
                skills.aggression += 5;
            }
            Card::Lion => {
                skills.composure += 5;
            }
            Card::General => {
                skills.control += 5;
            }
            Card::Magnet => {
                skills.handling += 5;
            }
            Card::FastHands => {
                skills.reflexes += 5;
            }
            Card::Guardian => {
                skills.intuition += 5;
            }
            Card::Rocket => {
                skills.kicking += 5;
            }
            Card::NONE => {} // nothing
        }
    }
}
