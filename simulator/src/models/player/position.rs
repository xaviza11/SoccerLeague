use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone)]
pub enum Position {
    Goalkeeper,
    Defender,
    Left_Back,
    Right_Back,
    Defensive_Midfield,
    Midfielder,
    Left_Midfield,
    Right_Midfield,
    Attacking_Midfield,
    Left_Wing,
    Right_Wing,
    Striker,
}

impl Position {
    pub fn as_str(&self) -> &'static str {
        match self {
            Position::Goalkeeper => "goalkeeper",
            Position::Defender => "defender",
            Position::Left_Back => "left_back",
            Position::Right_Back => "right_back",
            Position::Defensive_Midfield => "defensive_midfield",
            Position::Midfielder => "midfielder",
            Position::Left_Midfield => "left_midfield",
            Position::Right_Midfield => "right_midfield",
            Position::Attacking_Midfield => "attacking_midfield",
            Position::Striker => "striker",
            Position::Left_Wing => "left_wing",
            Position::Right_Wing => "right_wing",
        }
    }
}
