use rand::seq::SliceRandom;
use rand::thread_rng;
use rand::prelude::IndexedRandom;

pub fn generate_random_country() -> String {
    // Countries list
    const COUNTRIES: &[&str] = &[
        "Spain",
        "Mexico",
        "Argentina",
        "Colombia",
        "Peru",
        "Venezuela",
        "Chile",
        "Ecuador",
        "Guatemala",
        "Cuba",
        "Bolivia",
        "Dominican Republic",
        "Honduras",
        "Paraguay",
        "El Salvador",
        "Nicaragua",
        "Costa Rica",
        "Uruguay",
        "Panama",
        "Puerto Rico",
        "Brazil",
        "Portugal",
        "Croatia",
        "Germany",
        "Denmark",
        "Sweden",
        "Norway",
        "Finland",
        "Netherlands",
        "England",
        "Romania",
        "Hungary",
        "Italy",
        "Belgium",
        "Switzerland",
        "Austria",
        "Poland",
        "Czech Republic",
        "Slovakia",
        "Slovenia",
    ];

    // Select a random country
    let mut rng = thread_rng();
    COUNTRIES.choose(&mut rng).unwrap_or(&"Unknown").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_country_is_not_empty() {
        let country = generate_random_country();
        assert!(
            !country.is_empty(),
            "Expected non-empty country name, got empty string"
        );
    }

    #[test]
    fn test_country_is_in_list() {
        const COUNTRIES: &[&str] = &[
            "Spain", "Mexico", "Argentina", "Colombia", "Peru", "Venezuela", "Chile",
            "Ecuador", "Guatemala", "Cuba", "Bolivia", "Dominican Republic", "Honduras",
            "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Uruguay", "Panama",
            "Puerto Rico", "Brazil", "Portugal", "Croatia", "Germany", "Denmark", "Sweden",
            "Norway", "Finland", "Netherlands", "England", "Romania", "Hungary", "Italy",
            "Belgium", "Switzerland", "Austria", "Poland", "Czech Republic", "Slovakia",
            "Slovenia",
        ];

        let country = generate_random_country();
        assert!(
            COUNTRIES.contains(&country.as_str()),
            "Generated country '{}' is not in the predefined list",
            country
        );
    }

    #[test]
    fn test_multiple_random_countries_vary() {
        let samples: Vec<String> = (0..20).map(|_| generate_random_country()).collect();

        let unique_count = samples.iter().collect::<std::collections::HashSet<_>>().len();

        assert!(
            unique_count > 1,
            "Expected more than one unique country across samples, got only one"
        );
    }
}
