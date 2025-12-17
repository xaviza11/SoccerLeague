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
}

impl Instructions {
    pub fn generate_empty_instructions() -> Self {
        Self {
            offensive: vec![],
            defensive: vec![],
        }
    }
}
