use rand::Rng;
use serde::Deserialize;
use std::fs;
use rand::prelude::IndexedRandom;
use crate::models::player::countries::Country;
use crate::logics::player::names::{at, be, ch, cr, cz, de, dk, en, es, fi, fr, hu, it, nl, no, pl, pt, ro, se, si, sk, sr};

#[derive(Deserialize)]
struct NamesData {
    first: Vec<String>,
    last: Vec<String>,
}

pub struct CountryData {
    pub name: &'static str,
    pub first_names: &'static [&'static str],
    pub last_names: &'static [&'static str],
}

pub const COUNTRIES: &[CountryData] = &[
    // Spanish speaking
    CountryData { name: "Spain", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Mexico", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Argentina", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Colombia", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Peru", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Venezuela", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Chile", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Ecuador", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Guatemala", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Cuba", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Bolivia", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Dominican Republic", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Honduras", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Paraguay", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "El Salvador", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Nicaragua", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Costa Rica", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Uruguay", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Panama", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },
    CountryData { name: "Puerto Rico", first_names: &es::FIRST_NAMES, last_names: &es::LAST_NAMES },

    // Portuguese
    CountryData { name: "Brazil", first_names: &pt::FIRST_NAMES, last_names: &pt::LAST_NAMES },
    CountryData { name: "Portugal", first_names: &pt::FIRST_NAMES, last_names: &pt::LAST_NAMES },

    // German-speaking
    CountryData { name: "Germany", first_names: &de::FIRST_NAMES, last_names: &de::LAST_NAMES },
    CountryData { name: "Austria", first_names: &at::FIRST_NAMES, last_names: &at::LAST_NAMES },
    CountryData { name: "Switzerland", first_names: &ch::FIRST_NAMES, last_names: &ch::LAST_NAMES },

    // French-speaking
    CountryData { name: "France", first_names: &fr::FIRST_NAMES, last_names: &fr::LAST_NAMES },

    // English-speaking
    CountryData { name: "England", first_names: &en::FIRST_NAMES, last_names: &en::LAST_NAMES },

    // Nordic countries
    CountryData { name: "Denmark", first_names: &dk::FIRST_NAMES, last_names: &dk::LAST_NAMES },
    CountryData { name: "Sweden", first_names: &se::FIRST_NAMES, last_names: &se::LAST_NAMES },
    CountryData { name: "Norway", first_names: &no::FIRST_NAMES, last_names: &no::LAST_NAMES },
    CountryData { name: "Finland", first_names: &fi::FIRST_NAMES, last_names: &fi::LAST_NAMES },

    // Italy
    CountryData { name: "Italy", first_names: &it::FIRST_NAMES, last_names: &it::LAST_NAMES },

    // Belgium
    CountryData { name: "Belgium", first_names: &be::FIRST_NAMES, last_names: &be::LAST_NAMES },

    // Netherlands
    CountryData { name: "Netherlands", first_names: &nl::FIRST_NAMES, last_names: &nl::LAST_NAMES },

    // Poland
    CountryData { name: "Poland", first_names: &pl::FIRST_NAMES, last_names: &pl::LAST_NAMES },

    // Czech Republic
    CountryData { name: "Czech Republic", first_names: &cz::FIRST_NAMES, last_names: &cz::LAST_NAMES },

    // Slovakia
    CountryData { name: "Slovakia", first_names: &sk::FIRST_NAMES, last_names: &sk::LAST_NAMES },

    // Slovenia
    CountryData { name: "Slovenia", first_names: &si::FIRST_NAMES, last_names: &si::LAST_NAMES },

    // Serbia
    CountryData { name: "Serbia", first_names: &sr::FIRST_NAMES, last_names: &sr::LAST_NAMES },

    // Romania
    CountryData { name: "Romania", first_names: &ro::FIRST_NAMES, last_names: &ro::LAST_NAMES },

    // Croatia
    CountryData { name: "Croatia", first_names: &cr::FIRST_NAMES, last_names: &cr::LAST_NAMES },

    // Hungary
    CountryData { name: "Hungary", first_names: &hu::FIRST_NAMES, last_names: &hu::LAST_NAMES },
];

fn get_json_path(file: &str) -> String {
    format!("src/data/names/{}", file)
}

fn load_names(file: &str) -> NamesData {
    let path = get_json_path(file); // la ruta
    let json_str = std::fs::read_to_string(&path)
        .expect(&format!("Failed to read JSON file at {}", path));
    serde_json::from_str(&json_str).expect("Invalid JSON format")
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
        Country::France => "France",
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

fn generate_single_name(country: &Country) -> String {
    let country_str = country_to_str(country);

    let country_data = COUNTRIES.iter()
        .find(|c| c.name.eq_ignore_ascii_case(country_str))
        .unwrap_or_else(|| panic!("Country '{:?}' not found", country));

    let mut rng = rand::thread_rng();
    let first = country_data.first_names.choose(&mut rng).unwrap_or(&"Zorblax");
    let last = country_data.last_names.choose(&mut rng).unwrap_or(&"Prime");

    format!("{} {}", first, last)
}

pub fn generate_random_name(country: &Country) -> String {
    let normal = generate_single_name(country);
    let mixed1 = generate_single_name(country);
    let mixed2 = generate_single_name(country);

    let mut rng = rand::thread_rng();
    let roll: u8 = rng.gen_range(0..100);

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
