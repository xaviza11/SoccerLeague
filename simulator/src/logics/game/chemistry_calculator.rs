pub fn chemistry_calculator(countries: [&str; 11]) -> u32 {
    let mut unique: [&str; 11] = [""; 11];
    let mut counts: [u32; 11] = [0; 11];
    let mut unique_count = 0;

    for &country in countries.iter() {
        // check if country is already in unique array
        if let Some(pos) = unique[..unique_count].iter().position(|&c| c == country) {
            counts[pos] += 1; // increment count if exists
        } else {
            unique[unique_count] = country;
            counts[unique_count] = 1;
            unique_count += 1;
        }
    }

    // sum points with rules: 1 ->0, 2->2, 3->3, 4->4, 5->5, 6+ ->5
    counts[..unique_count]
        .iter()
        .map(|&c| match c {
            1 => 0,
            2..=5 => c,
            _ => 5,
        })
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_example() {
        let countries = ["Spain","Spain","Spain","Spain","Spain","Spain","France","France","Brasil","Salvador","Costa Rica"];
        assert_eq!(chemistry_calculator(countries), 7);
    }
    
    #[test] fn six_countries() {
        let countries = ["A","A","A","A","A","A","B","B","C","C","D"];
        // A 6 ->5, B 2->2, C 2->2, D 1->0 = 9
        assert_eq!(chemistry_calculator(countries), 9);
    }

    #[test]
    fn test_various_counts() {
        let countries = ["Spain","Spain","France","France","France","Italy","Italy","Italy","Italy","Italy","Germany"];
        // Spain 2 ->2, France 3->3, Italy 5->5, Germany 1->0 = 10
        assert_eq!(chemistry_calculator(countries), 10);
    }

    #[test]
    fn test_all_ones() {
        let countries = ["A","B","C","D","E","F","G","H","I","J","K"];
        assert_eq!(chemistry_calculator(countries), 0);
    }
}
