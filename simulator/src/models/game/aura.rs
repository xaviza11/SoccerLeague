use serde::{ Deserialize, Serialize };
use crate::models::player::skills::Skills;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum AuraSkill {
    None,
    Shooting,
    Passing,
    Dribbling,
    Defense,
    Physical,
    Speed,
    Stamina,
    Vision,
    Crossing,
    Finishing,
    Aggression,
    Composure,
    Control,
    Handling,
    Reflexes,
    Kicking,
    Intuition,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Aura {
    pub name: String,
    pub skill: AuraSkill,
    pub amount: u8,
}

impl Aura {
    pub fn from_name(name: &str) -> Option<Self> {
        match name {
            "None" | "" =>
                Some(Self {
                    name: "None".to_string(),
                    skill: AuraSkill::None,
                    amount: 0,
                }),

            // --- Shooting ---
            "Deadeye" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Shooting,
                    amount: 3,
                }),

            // --- Passing ---
            "Playmaker" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Passing,
                    amount: 3,
                }),

            // --- Dribbling ---
            "Serpent" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Dribbling,
                    amount: 3,
                }),

            // --- Defense ---
            "IronWall" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Defense,
                    amount: 3,
                }),

            // --- Physical ---
            "Colossus" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Physical,
                    amount: 4,
                }),

            // --- Speed ---
            "Lightning" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Speed,
                    amount: 3,
                }),

            // --- Stamina ---
            "EndlessEngine" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Stamina,
                    amount: 4,
                }),

            // --- Vision ---
            "Oracle" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Vision,
                    amount: 3,
                }),

            // --- Crossing ---
            "SniperCrosser" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Crossing,
                    amount: 3,
                }),

            // --- Finishing ---
            "Assassin" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Finishing,
                    amount: 3,
                }),

            // --- Aggression ---
            "Berserker" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Aggression,
                    amount: 3,
                }),

            // --- Composure ---
            "IceVeins" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Composure,
                    amount: 3,
                }),

            // --- Control ---
            "Maestro" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Control,
                    amount: 3,
                }),

            // --- Handling ---
            "MagnetHands" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Handling,
                    amount: 3,
                }),

            // --- Reflexes ---
            "Flashpoint" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Reflexes,
                    amount: 3,
                }),

            // --- Intuition ---
            "SixthSense" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Intuition,
                    amount: 3,
                }),

            // --- Kicking ---
            "CannonLeg" =>
                Some(Self {
                    name: name.to_string(),
                    skill: AuraSkill::Kicking,
                    amount: 4,
                }),

            _ => None,
        }
    }

    pub fn apply_to_player(&self, skills: &mut Skills) {
        match self.skill {
            AuraSkill::Shooting => {
                skills.shooting += self.amount;
            }
            AuraSkill::Passing => {
                skills.passing += self.amount;
            }
            AuraSkill::Dribbling => {
                skills.dribbling += self.amount;
            }
            AuraSkill::Defense => {
                skills.defense += self.amount;
            }
            AuraSkill::Physical => {
                skills.physical += self.amount;
            }
            AuraSkill::Speed => {
                skills.speed += self.amount;
            }
            AuraSkill::Stamina => {
                skills.stamina += self.amount;
            }
            AuraSkill::Vision => {
                skills.vision += self.amount;
            }
            AuraSkill::Crossing => {
                skills.crossing += self.amount;
            }
            AuraSkill::Finishing => {
                skills.finishing += self.amount;
            }
            AuraSkill::Aggression => {
                skills.aggression += self.amount;
            }
            AuraSkill::Composure => {
                skills.composure += self.amount;
            }
            AuraSkill::Control => {
                skills.control += self.amount;
            }
            AuraSkill::Handling => {
                skills.handling += self.amount;
            }
            AuraSkill::Reflexes => {
                skills.reflexes += self.amount;
            }
            AuraSkill::Intuition => {
                skills.intuition += self.amount;
            }
            AuraSkill::Kicking => {
                skills.kicking += self.amount;
            }
            AuraSkill::None => {}
        }
    }
}
