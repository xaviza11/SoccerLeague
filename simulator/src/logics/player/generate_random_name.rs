use rand::Rng;
use serde::Deserialize;
use std::fs;
use rand::prelude::IndexedRandom;
use crate::models::player::countries::Country;

#[derive(Deserialize)]
struct NamesData {
    first: Vec<String>,
    last: Vec<String>,
}

struct CountryData {
    name: &'static str,
    file: &'static str,
}

const COUNTRIES: &[CountryData] = &[
    // Spanish speaking countries
    CountryData { name: "Spain", file: "es.json" },
    CountryData { name: "Mexico", file: "es.json" },
    CountryData { name: "Argentina", file: "es.json" },
    CountryData { name: "Colombia", file: "es.json" },
    CountryData { name: "Peru", file: "es.json" },
    CountryData { name: "Venezuela", file: "es.json" },
    CountryData { name: "Chile", file: "es.json" },
    CountryData { name: "Ecuador", file: "es.json" },
    CountryData { name: "Guatemala", file: "es.json" },
    CountryData { name: "Cuba", file: "es.json" },
    CountryData { name: "Bolivia", file: "es.json" },
    CountryData { name: "Dominican Republic", file: "es.json" },
    CountryData { name: "Honduras", file: "es.json" },
    CountryData { name: "Paraguay", file: "es.json" },
    CountryData { name: "El Salvador", file: "es.json" },
    CountryData { name: "Nicaragua", file: "es.json" },
    CountryData { name: "Costa Rica", file: "es.json" },
    CountryData { name: "Uruguay", file: "es.json" },
    CountryData { name: "Panama", file: "es.json" },
    CountryData { name: "Puerto Rico", file: "es.json" },

    // Portuguese speaking countries
    CountryData { name: "Brazil", file: "pt.json" },//?
    CountryData { name: "Portugal", file: "pt.json" },//?

    // Other countries
    CountryData { name: "Croatia", file: "cr.json" },//?
    CountryData { name: "French", file: "fr.json" },//?
    CountryData { name: "Germany", file: "de.json" },//?
    CountryData { name: "Denmark", file: "dk.json" },//?
    CountryData { name: "Sweden", file: "se.json" },//?
    CountryData { name: "Norway", file: "no.json" },//?
    CountryData { name: "Finland", file: "fi.json" },//?
    CountryData { name: "Netherlands", file: "nl.json" },//?
    CountryData { name: "England", file: "en.json" },//?
    CountryData { name: "Romania", file: "ro.json" },//?
    CountryData { name: "Hungary", file: "hu.json" },//?
    CountryData { name: "Italy", file: "it.json" },//?
    CountryData { name: "Belgium", file: "be.json" }, //?
    CountryData { name: "Switzerland", file: "ch.json" },//?
    CountryData { name: "Austria", file: "at.json" }, //?
    CountryData { name: "Poland", file: "pl.json" },//?
    CountryData { name: "Czech Republic", file: "cz.json" },//?
    CountryData { name: "Slovakia", file: "sk.json" },//?
    CountryData { name: "Slovenia", file: "si.json" },//?
    CountryData { name: "Serbia", file: "sr.json" },//?
];

fn get_json_path(file: &str) -> String {
    format!("src/data/names/{}", file)
}

fn load_names(file: &str) -> NamesData {
    let path = get_json_path(file);
    let data = fs::read_to_string(&path).expect(&format!("Failed to read JSON file at {}", path));
    serde_json::from_str(&data).expect("Invalid JSON format")
}

fn country_to_str(country: &Country) -> &'static str {
    match country {
      Country::Spain => "Spain",
        Country::Mexico => "Mexico",
        Country::Argentina => "Argentina",
        Country::Colombia => "Colombia",
        Country::Peru => "Peru",
        Country::Venezuela => "Venezuela",
        Country::Chile => "Chile",
        Country::Ecuador => "Ecuador",
        Country::Guatemala => "Guatemala",
        Country::Cuba => "Cuba",
        Country::Bolivia => "Bolivia",
        Country::DominicanRepublic => "Dominican Republic",
        Country::Honduras => "Honduras",
        Country::Paraguay => "Paraguay",
        Country::ElSalvador => "El Salvador",
        Country::Nicaragua => "Nicaragua",
        Country::CostaRica => "Costa Rica",
        Country::Uruguay => "Uruguay",
        Country::Panama => "Panama",
        Country::PuertoRico => "Puerto Rico",
        Country::Brazil => "Brazil",
        Country::Portugal => "Portugal",
        Country::Croatia => "Croatia",
        Country::French => "French",
        Country::Germany => "Germany",
        Country::Denmark => "Denmark",
        Country::Sweden => "Sweden",
        Country::Norway => "Norway",
        Country::Finland => "Finland",
        Country::Netherlands => "Netherlands",
        Country::England => "England",
        Country::Romania => "Romania",
        Country::Hungary => "Hungary",
        Country::Italy => "Italy",
        Country::Belgium => "Belgium",
        Country::Switzerland => "Switzerland",
        Country::Austria => "Austria",
        Country::Poland => "Poland",
        Country::CzechRepublic => "Czech Republic",
        Country::Slovakia => "Slovakia",
        Country::Slovenia => "Slovenia",
        Country::Serbia => "Serbia",
        _ => "Unknown",
    }
}

fn generate_single_name(country_name: &Country) -> String {
    let country_str = country_to_str(country_name);

    let country = COUNTRIES
        .iter()
        .find(|c| c.name.eq_ignore_ascii_case(country_str))
        .unwrap_or_else(|| panic!("Country '{:?}' not found in list", country_name));

    let names = load_names(country.file);
    let mut rng = rand::rng();

    // Fallback alien name in case of empty name parts
    let alien_name = "Zorblax Prime".to_string();

    let first = names.first.choose(&mut rng);
    let last = names.last.choose(&mut rng);

    match (first, last) {
        (Some(f), Some(l)) if !f.is_empty() && !l.is_empty() => format!("{} {}", f, l),
        _ => alien_name,
    }
}

pub fn generate_random_name(country_name: &Country) -> String {
    let normal = generate_single_name(country_name);
    let mixed1 = generate_single_name(country_name);
    let mixed2 = generate_single_name(country_name);

    let mut rng = rand::rng();
    let roll: u8 = rng.random_range(0..100);

    match roll {
        0..=95 => normal,
        96..=97 => mixed1,
        _ => mixed2,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::player::countries::Country;

    #[test]
    fn test_generate_single_name_returns_non_empty_string() {
        let name = generate_single_name(&Country::Spain);
        assert!(!name.is_empty());
    }
}
