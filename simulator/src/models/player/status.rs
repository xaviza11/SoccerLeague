use serde::{Serialize, Deserialize};
use crate::utils::generate_random_number::generate_number_by_range;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Status {
    pub age: u8,
    pub is_active: bool,
    pub injured_until: String,
    pub retirement_age: u8,
}

impl Status {
    pub fn generate_default_status() -> Self {
        Self {
            age: generate_number_by_range(16, 32),
            is_active: true,
            injured_until: "".to_string(), 
            retirement_age: generate_number_by_range(33, 38),
        }
    }
}
