# ⚽ Soccer Simulator Documentation

## 🧭 Overview

The **Soccer Simulator** provides two core functionalities:

1. **Player Generation** – create realistic soccer players with skill attributes, nationalities, and positions.
2. **Game Simulation** – simulate full soccer matches between two teams, including statistics, substitutions, and detailed logs.

---

## 🧍‍♂️ 1. Player Simulation

The simulator can generate soccer players with a variety of skill profiles and traits.

### 🧾 Example Player JSON

```json
{
          "name": "Bruce Davis",
          "country": "England",
          "position": "Right_Wing",
          "current_position": "Right_Wing",
          "original_position": "Right_Wing",
          "age": 24,
          "is_active": true,
          "injured_until": "",
          "max_skill_level": 82,
          "retirement_age": 455,
          "number": 22,
          "status": {
            "age": 24,
            "is_active": true,
            "injured_until": "",
            "retirement_age": 83
          },
          "skills": {
            "shooting": 55,
            "passing": 55,
            "dribbling": 55,
            "defense": 55,
            "physical": 55,
            "speed": 55,
            "stamina": 55,
            "vision": 55,
            "crossing": 55,
            "finishing": 55,
            "aggression": 55,
            "composure": 55,
            "control": 55,
            "intuition": 55,
            "handling": 55,
            "kicking": 55,
            "reflexes": 55
          },
          "card": "NONE",
          "instructions": {
            "offensive": ["Pass", "Dribble", "Shoot"],
            "defensive": ["Destroy", "Normal", "Offside"],
            "penalty_kicker": 1,
            "corner_kicker": 1,
            "free_kick_kicker": 1
          },
          "height_cm": 184,
          "stats": {
            "goals": 55,
            "total_shots": 55,
            "total_passes": 55,
            "faults": 55,
            "assists": 55,
            "red_cards": 55,
            "yellow_cards": 55,
            "total_games": 55
          }
        },
```

---

### 🔧 Player Generation Endpoint

The **Player Generation API** allows clients to create customized player profiles.

**Parameters:**

- `skill_range` _(number)_ – defines the average range for the player’s skill attributes.
- `position` _(string)_ – specifies the player’s main position (e.g., “Striker”, “Goalkeeper”, “Midfielder”).

---

### 🧠 Name Generation Logic

The simulator includes a randomized name generation system (`src/logics/generate_random_name.rs`):

1. A random country is selected from a predefined list.
2. The simulator loads a corresponding JSON file from `data/name/{country}.json`, containing first and last names.
3. If no file is found, an **“alien” name** is generated.
4. There is a **4% probability** that the generated name combines parts from two different countries for diversity.

---

### ⚙️ Player Attributes

- **position**: The player’s default, natural position.
- **current_position**: The current in-game assignment.
- **original_position**: The base role for performance reference.

---

### 🧩 Instructions and Cards

- **Instructions** – `offensive_instructions` and `defensive_instructions` modify how a player behaves in-game.
- **Cards** – the `card` field can apply modifiers (e.g., skill boosts or penalties) to simulate form or conditions.

---

## 🏟️ 2. Game Simulation

The **Game Simulation** module models a complete soccer match between two teams.

---

### 🧱 Team JSON Structure

The simulator expects the following structure for both teams:

```json
{
  "team_a": {
    "name": "Team Alpha",
    "players": [],
    "bench_players": [],
    "aura": [],
    "substitutions": [
      { "minute": 45, "player_out": 0, "player_in": 0 },
      { "minute": 60, "player_out": 2, "player_in": 3 }
    ]
  },
  "team_b": {
    "name": "Team Beta",
    "players": [],
    "bench_players": [],
    "aura": [],
    "substitutions": [{ "minute": 70, "player_out": 5, "player_in": 8 }]
  }
}
```

#### Field Descriptions

| Field           | Type     | Description                               |
| --------------- | -------- | ----------------------------------------- |
| `name`          | `string` | Team name                                 |
| `players`       | `array`  | Starting 11 players                       |
| `bench_players` | `array`  | Substitute players                        |
| `aura`          | `array`  | Strings that modify team or player skills |
| `substitutions` | `array`  | List of substitution events               |

**Substitution Object Fields:**

- `minute`: When the substitution occurs
- `player_out`: Index or ID of the player leaving
- `player_in`: Index or ID of the player entering

---

## 📊 Game Simulation Return Structure

After simulation, the server returns a **`GameResult`** JSON representing the entire match.

### 🧾 Example Response

```json
{
  "logs": {
    "player_name": "Raul Almeida",
    "minute": 0,
    "description": "failed.shoot",
    "player_number": 1,
    "team_name": "Team Alphabet"
  },
  "game_result": {
    "score": [0, 3]
  }
}
```

---

### 📘 Field Descriptions

#### Match Summary

| Field                                                 | Type            | Description                           |
| ----------------------------------------------------- | --------------- | ------------------------------------- |
| `score`                                               | `(u8, u8)`      | Final score — `[Team A, Team B]`      |
| `logs`                                                | `array[string]` | Chronological list of match events    |
| `cards_player_a` / `cards_player_b`==> TODO           | `array[string]` | Players who received yellow/red cards | 
| `scorers_player_a` / `scorers_player_b`==> TODO       | `array[string]` | Players who scored goals              |
| `injuries_player_a` / `injuries_player_b`==> TODO     | `array[string]` | Injured players                       |
| `assistants_player_a` / `assistants_player_b`==> TODO | `array[string]` | Players who assisted goals            |

#### Statistical Data (`data`) (TODO)

| Field           | Type | Description              |
| --------------- | ---- | ------------------------ |
| passes          | i32  | Total passes attempted   |
| passes_suc      | i32  | Successful passes        |
| shoots          | i32  | Total shots              |
| shoots_suc      | i32  | Shots on target or goals |
| dribbles        | i32  | Total dribble attempts   |
| dribbles_suc    | i32  | Successful dribbles      |
| advances        | i32  | Forward progressions     |
| advances_suc    | i32  | Successful progressions  |
| long_pass       | i32  | Long passes attempted    |
| long_pass_suc   | i32  | Successful long passes   |
| cross           | i32  | Cross attempts           |
| cross_suc       | i32  | Successful crosses       |
| penalties       | i32  | Penalty kicks taken      |
| penalties_goals | i32  | Penalty goals            |
| corners         | i32  | Corner kicks taken       |
| corners_goals   | i32  | Goals from corners       |
| controls        | i32  | Ball control attempts    |
| controls_suc    | i32  | Successful controls      |
| free_kicks      | i32  | Free kicks taken         |
| free_kicks_suc  | i32  | Successful free kicks    |
| offsides        | i32  | Total offsides           |

---

## 🧩 Summary

The **Soccer Simulator** offers:

- **Player creation** with realistic attributes and name generation.
- **Match simulation** between two dynamically generated teams.
- **Detailed statistics and event logging** for analytics, visualization, or AI model training.

The simulator’s output is serialized as JSON and can be integrated into web services, dashboards, or game engines.

---

**Author:** Soccer Simulator Project
**Language:** Rust 🦀
**Modules:** `player`, `game`, `simulation`, `data`


