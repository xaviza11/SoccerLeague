use rand::Rng;
use rand::thread_rng;
use rand::seq::SliceRandom;
use rand::prelude::IndexedRandom;

// ================================
// Possession Functions
// ================================

pub fn select_initial_possession() -> [u8; 2] {
    let mut rng = thread_rng();
    let advance = rng.gen_range(1..=11);
    [0, advance]
}

pub fn select_half_part_possession() -> [u8; 2] {
    let mut rng = thread_rng();
    let advance = rng.gen_range(1..=11);
    [1, advance]
}

// ================================
// Gaussian Rebound Function (no rand_distr)
// ================================

pub fn rebound_ball(x: f32) -> (f32, u8) {
    const STD_DEV: f32 = 2.0;
    let mut rng = thread_rng();

    let result: f32;

    // Box–Muller transform to simulate normal distribution
    loop {
        let u1: f32 = rng.gen_range(0.0..1.0);
        let u2: f32 = rng.gen_range(0.0..1.0);
        let z0 = (-2.0 * u1.ln()).sqrt() * (2.0 * std::f32::consts::PI * u2).cos();

        let sample = x + STD_DEV * z0;
        if sample >= 0.0 && sample <= 11.0 {
            result = sample;
            break;
        }
    }

    let team: u8 = if rng.gen_bool(0.5) { 0 } else { 1 };
    (result, team)
}

// ================================
// Long Distance Ball Function
// ================================

pub fn long_distance_ball(x: &str) -> &'static str {
    const POSITIONS: [&[&str]; 4] = [
        &["Goalkeeper"],
        &["Left_Back", "Defender", "Right_Back"],
        &[
            "Left_Midfield",
            "Defensive_Midfield",
            "Midfield",
            "Attacking_Midfield",
            "Right_Midfield",
        ],
        &["Left_Wing", "Striker", "Right_Wing"],
    ];

    let mut zone = 0;
    for (i, group) in POSITIONS.iter().enumerate() {
        if group.contains(&x) {
            zone = i;
            break;
        }
    }

    let mut rng = thread_rng();
    let advance = rng.gen_range(1..=2); // move 1–2 zones forward
    let new_zone = (zone + advance).min(POSITIONS.len() - 1);
    POSITIONS[new_zone].choose(&mut rng).unwrap()
}

// ================================
// Short Distance Ball Function
// ================================

pub fn short_distance_ball(x: &str) -> &'static str {
    const POSITIONS: [&[&str]; 4] = [
        &["Goalkeeper"],
        &["Left_Back", "Defender", "Right_Back"],
        &[
            "Left_Midfield",
            "Defensive_Midfield",
            "Midfield",
            "Attacking_Midfield",
            "Right_Midfield",
        ],
        &["Left_Wing", "Striker", "Right_Wing"],
    ];

    let mut zone = 0;
    for (i, group) in POSITIONS.iter().enumerate() {
        if group.contains(&x) {
            zone = i;
            break;
        }
    }

    let mut rng = thread_rng();
    // ✅ Use i32 because rand 0.9 does not support isize
    let advance: i32 = rng.gen_range(-1..=1);
    let new_zone = ((zone as i32 + advance)
        .clamp(0, (POSITIONS.len() as i32 - 1))) as usize;

    POSITIONS[new_zone].choose(&mut rng).unwrap()
}

// ================================
// Tests
// ================================
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_select_initial_possession() {
        let result = select_initial_possession();
        assert_eq!(result[0], 0);
        assert!(result[1] >= 1 && result[1] <= 11);
    }

    #[test]
    fn test_select_half_part_possession() {
        let result = select_half_part_possession();
        assert_eq!(result[0], 1);
        assert!(result[1] >= 1 && result[1] <= 11);
    }

    #[test]
    fn test_rebound_ball_bounds() {
        for _ in 0..100 {
            let (pos, team) = rebound_ball(5.0);
            assert!(pos >= 0.0 && pos <= 11.0);
            assert!(team == 0 || team == 1);
        }
    }

    #[test]
    fn test_long_distance_ball_targets() {
        let roles = [
            "Goalkeeper",
            "Left_Back",
            "Defender",
            "Right_Back",
            "Left_Midfield",
            "Defensive_Midfield",
            "Midfield",
            "Attacking_Midfield",
            "Right_Midfield",
            "Left_Wing",
            "Striker",
            "Right_Wing",
        ];

        for &role in roles.iter() {
            let target = long_distance_ball(role);
            assert!(roles.contains(&target));
        }
    }

    #[test]
    fn test_short_distance_ball_targets() {
        let roles = [
            "Goalkeeper",
            "Left_Back",
            "Defender",
            "Right_Back",
            "Left_Midfield",
            "Defensive_Midfield",
            "Midfield",
            "Attacking_Midfield",
            "Right_Midfield",
            "Left_Wing",
            "Striker",
            "Right_Wing",
        ];

        for &role in roles.iter() {
            let target = short_distance_ball(role);
            assert!(roles.contains(&target));
        }
    }
}
