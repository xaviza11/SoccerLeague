use serde::{Deserialize, Serialize};
#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub enum OffensiveInstruction {
    Shoot,
    Pass,
    Dribble,
    Cross,
    LongBall,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub enum DefensiveInstruction {
    Destroy,
    Normal,
    Passive,
    Offside,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Instructions {
    pub offensive: Vec<OffensiveInstruction>,
    pub defensive: Vec<DefensiveInstruction>,
    pub penalty_kicker: u8,
    pub corner_kicker: u8,
    pub free_kick_kicker: u8
}

impl Instructions {
    pub fn generate_empty_instructions() -> Self {
        Self {
            offensive: vec![],
            defensive: vec![],
            penalty_kicker: 7,
            corner_kicker: 7,
            free_kick_kicker: 7
        }
    }
}
