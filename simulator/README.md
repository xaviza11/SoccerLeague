# Soccer Simulator Documentation

## Overview

This simulator is designed for two primary purposes:

1. **Creating soccer players**
2. **Simulating soccer games**

---

## 1. Player Simulation

The server generates player objects with the following JSON structure:

```json
{
  "name": "João Vaz",
  "country": "Brazil",
  "position": "Striker",
  "current_position": "Striker",
  "original_position": "Striker",
  "age": 24,
  "is_active": true,
  "injured_until": "",
  "max_skill_level": 83,
  "retirement_age": 35,
  "skills": {
    "shooting": 99,
    "passing": 99,
    "dribbling": 99,
    "defense": 99,
    "physical": 99,
    "speed": 99,
    "stamina": 99,
    "vision": 99,
    "crossing": 99,
    "finishing": 99,
    "aggression": 99,
    "composure": 99,
    "control": 99,
    "intuition": 0,
    "handling": 0,
    "kicking": 0,
    "reflexes": 0
  },
  "card": "NONE",
  "offensive_instructions": [],
  "defensive_instructions": [],
  "height_cm": 160
}
```

## Player Generation Endpoint

The simulator provides a dedicated endpoint to generate players. It accepts the following parameters:

- `skill_range`: A number representing the desired average value for the player's skills.
- `position`: The primary position of the player.

---

## Name Generation Logic

The name generation process is implemented in `src/logics/generate_random_name.rs` and works as follows:

1. A random country is selected from a predefined vector of countries.
2. The simulator accesses the corresponding data file: `data/name/{country}.json`, which contains lists of first names and surnames.
3. If this process fails (e.g., the file is missing), the system generates an "alien" name.
4. To add variety, there is a **4% chance** that the generated name will be a mix of names from two different countries.

---

## Player Positions

Each player has three associated positions:

- `position`: Their primary and default role on the field.
- `current_position`: The position the player is currently assigned to play.
- `original_position`: The player's natural position, used as a reference as the game progresses.

---

## Instructions and Cards

- **Instructions**: The `offensive_instructions` and `defensive_instructions` arrays modify the player's decision-making logic during game simulations.  
- **Cards**: The `card` attribute can be used to apply a modifier that enhances one of the player's skills.
