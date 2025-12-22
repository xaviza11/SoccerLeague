use rand::seq::SliceRandom;
use crate::models::player::countries::Country;
use rand::prelude::IndexedRandom;

pub fn generate_random_country() -> Country {
    const COUNTRIES: &[Country] = &[
        Country::Spain,
        Country::Mexico,
        Country::Argentina,
        Country::Colombia,
        Country::Peru,
        Country::Venezuela,
        Country::Chile,
        Country::Ecuador,
        Country::Guatemala,
        Country::Cuba,
        Country::Bolivia,
        Country::DominicanRepublic,
        Country::Honduras,
        Country::Paraguay,
        Country::ElSalvador,
        Country::Nicaragua,
        Country::CostaRica,
        Country::Uruguay,
        Country::Panama,
        Country::PuertoRico,
        Country::Brazil,
        Country::Portugal,
        Country::Croatia,
        Country::Germany,
        Country::Denmark,
        Country::Sweden,
        Country::Norway,
        Country::Finland,
        Country::Netherlands,
        Country::England,
        Country::Romania,
        Country::Hungary,
        Country::Italy,
        Country::Belgium,
        Country::Switzerland,
        Country::Austria,
        Country::Poland,
        Country::CzechRepublic,
        Country::Slovakia,
        Country::Slovenia,
        Country::Serbia,
        Country::France
    ];

    let mut rng = rand::rng();
    COUNTRIES.choose(&mut rng).expect("No countries available").clone()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    #[test]
    fn test_country_is_valid_enum() {
        let country = generate_random_country();
        // Simplemente validar que es un Country, si compila y no es None, está bien
        println!("{:?}", country);
    }

    #[test]
    fn test_country_is_in_list() {
        const VALID_COUNTRIES: &[Country] = &[
            Country::Spain,
            Country::Mexico,
            Country::Argentina,
            Country::Colombia,
            Country::Peru,
            Country::Venezuela,
            Country::Chile,
            Country::Ecuador,
            Country::Guatemala,
            Country::Cuba,
            Country::Bolivia,
            Country::DominicanRepublic,
            Country::Honduras,
            Country::Paraguay,
            Country::ElSalvador,
            Country::Nicaragua,
            Country::CostaRica,
            Country::Uruguay,
            Country::Panama,
            Country::PuertoRico,
            Country::Brazil,
            Country::Portugal,
            Country::Croatia,
            Country::Germany,
            Country::Denmark,
            Country::Sweden,
            Country::Norway,
            Country::Finland,
            Country::Netherlands,
            Country::England,
            Country::Romania,
            Country::Hungary,
            Country::Italy,
            Country::Belgium,
            Country::Switzerland,
            Country::Austria,
            Country::Poland,
            Country::CzechRepublic,
            Country::Slovakia,
            Country::Slovenia,
            Country::Serbia,
            Country::France
        ];

        let country = generate_random_country();
        assert!(
            VALID_COUNTRIES.contains(&country),
            "Generated country {:?} is not in the expected Country enum list",
            country
        );
    }

    #[test]
    fn test_multiple_random_countries_vary() {
        let samples: Vec<Country> = (0..20).map(|_| generate_random_country()).collect();
        let unique_count = samples.iter().collect::<HashSet<_>>().len();

        assert!(unique_count > 1, "Expected variation in random countries, but all were the same");
    }
}
