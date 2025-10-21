use rand::seq::SliceRandom;
use rand::Rng;
use serde::Deserialize;
use std::fs;
use rand::prelude::IndexedRandom;

#[derive(Deserialize)]
struct NamesData {
    first: Vec<String>,
    last: Vec<String>,
}

struct Country {
    name: &'static str,
    file: &'static str,
}

const COUNTRIES: &[Country] = &[
    // Spanish speaking countries
    Country { name: "Spain", file: "es.json" },
    Country { name: "Mexico", file: "es.json" },
    Country { name: "Argentina", file: "es.json" },
    Country { name: "Colombia", file: "es.json" },
    Country { name: "Peru", file: "es.json" },
    Country { name: "Venezuela", file: "es.json" },
    Country { name: "Chile", file: "es.json" },
    Country { name: "Ecuador", file: "es.json" },
    Country { name: "Guatemala", file: "es.json" },
    Country { name: "Cuba", file: "es.json" },
    Country { name: "Bolivia", file: "es.json" },
    Country { name: "Dominican Republic", file: "es.json" },
    Country { name: "Honduras", file: "es.json" },
    Country { name: "Paraguay", file: "es.json" },
    Country { name: "El Salvador", file: "es.json" },
    Country { name: "Nicaragua", file: "es.json" },
    Country { name: "Costa Rica", file: "es.json" },
    Country { name: "Uruguay", file: "es.json" },
    Country { name: "Panama", file: "es.json" },
    Country { name: "Puerto Rico", file: "es.json" },

    // Portuguese speaking countries
    Country { name: "Brazil", file: "pt.json" },//?
    Country { name: "Portugal", file: "pt.json" },//?

    // Other countries
    Country { name: "Croatia", file: "cr.json" },//?
    Country { name: "French", file: "fr.json" },//?
    Country { name: "Germany", file: "de.json" },//?
    Country { name: "Denmark", file: "dk.json" },//?
    Country { name: "Sweden", file: "se.json" },//?
    Country { name: "Norway", file: "no.json" },//?
    Country { name: "Finland", file: "fi.json" },//?
    Country { name: "Netherlands", file: "nl.json" },//?
    Country { name: "England", file: "en.json" },//?
    Country { name: "Romania", file: "ro.json" },//?
    Country { name: "Hungary", file: "hu.json" },//?
    Country { name: "Italy", file: "it.json" },//?
    Country { name: "Belgium", file: "be.json" }, //?
    Country { name: "Switzerland", file: "ch.json" },//?
    Country { name: "Austria", file: "at.json" }, //?
    Country { name: "Poland", file: "pl.json" },//?
    Country { name: "Czech Republic", file: "cz.json" },//?
    Country { name: "Slovakia", file: "sk.json" },//?
    Country { name: "Slovenia", file: "si.json" },//?
    Country { name: "Serbia", file: "sr.json" },//?
];

fn get_json_path(file: &str) -> String {
    format!("src/data/names/{}", file)
}

fn load_names(file: &str) -> NamesData {
    let path = get_json_path(file);
    let data = fs::read_to_string(&path).expect(&format!("Failed to read JSON file at {}", path));
    serde_json::from_str(&data).expect("Invalid JSON format")
}

fn generate_single_name(country_name: &str, mixed_mode: bool) -> String {
    let country = COUNTRIES
        .iter()
        .find(|c| c.name.eq_ignore_ascii_case(country_name))
        .unwrap_or_else(|| panic!("Country '{}' not found in list", country_name));

    let names = load_names(country.file);
    let mut rng = rand::thread_rng();

    if mixed_mode {
        let first = names.first.choose(&mut rng).unwrap();
        let last = names.last.choose(&mut rng).unwrap();

        if rng.gen_bool(0.5) {
            format!("{} {}", first, last)
        } else {
            format!("{} {}", first, last)
        }
    } else {
        let first = names.first.choose(&mut rng).unwrap();
        let last = names.last.choose(&mut rng).unwrap();
        format!("{} {}", first, last)
    }
}

/// Returns one name with 96% normal, 2% mixed1, 2% mixed2
pub fn generate_random_name(country_name: &str) -> String {
    let normal_name = generate_single_name(country_name, false);
    let mixed1 = generate_single_name(country_name, true);
    let mixed2 = generate_single_name(country_name, true);

    let mut rng = rand::thread_rng();
    let roll: u8 = rng.gen_range(0..100);

    match roll {
        0..=95 => normal_name,
        96 => mixed1,
        _ => mixed2,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::io::Write;

    fn setup_test_json(file: &str) {
        let path = format!("src/data/names/{}", file);
        let dir = std::path::Path::new("src/data/names");
        if !dir.exists() {
            std::fs::create_dir_all(dir).unwrap();
        }

        let content = r#"
        {
            "first": ["Juan", "Pedro", "Luis"],
            "last": ["Gomez", "Perez", "Lopez"]
        }
        "#;
        let mut file = fs::File::create(&path).unwrap();
        file.write_all(content.as_bytes()).unwrap();
    }

    #[test]
    fn test_generate_single_name_returns_non_empty_string() {
        setup_test_json("es.json");

        let name = generate_single_name("Spain", false);
        assert!(
            !name.is_empty(),
            "Expected non-empty generated name, got empty string"
        );
    }

    #[test]
    #[should_panic(expected = "not found in list")]
    fn test_generate_single_name_invalid_country_panics() {
        setup_test_json("es.json");
        generate_single_name("Atlantis", false);
    }
}
