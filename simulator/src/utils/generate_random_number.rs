use rand::Rng;

pub fn generate_number_by_range(a: u8, b: u8) -> u8 {
    let mut rng = rand::rng();
    rng.random_range(a..=b)
}
