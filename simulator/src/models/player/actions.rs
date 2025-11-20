use crate::models::game::team::Team;
use crate::models::player::player::Player;
use crate::models::player::position::Position;
use crate::utils::generate_random_number::generate_number_by_range;
use rand::prelude::*;
use rand_distr::{ Normal, Distribution };

#[derive(Debug, Clone)]
pub struct Actions;

//? Missing create the penalty and free_kick functions the shooter needs become of Teams Instructions!!!
//? Missing create the logs system to register what happen in the match!!!
//? Missing create the fatigue system to decrease the stamina of the players as the match goes on!!!
//? Missing create the stats system to register the actions of each player during the match!!!
//? Missing create the resume of the match to show the match result in frontend and calculate the elo increase!!

impl Actions {
    fn stamina_factor(player: &Player) -> f32 {
        ((player.skills.stamina as f32) / 100.0).clamp(0.4, 1.0)
    }

    /// Get mutable reference to player with ball
    fn get_player<'a>(teams: &'a mut [Team; 2], ball_possession: &mut [u8; 2]) -> &'a mut Player {
        // Access indices safely and convert u8 to usize
        &mut teams[ball_possession[0] as usize].players[ball_possession[1] as usize]
    }

    pub fn pass(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        last_pass_player: &mut [u8; 2]
    ) -> bool {
        // Current ball holder
        let passer =
            teams[ball_possession[0] as usize].players[ball_possession[1] as usize].clone();

        // Calculate pass quality
        let pass_quality =
            (passer.skills.passing as f32) * 0.6 +
            (passer.skills.vision as f32) * 0.25 +
            (passer.skills.composure as f32) * 0.15;

        let base_chance = (pass_quality / 100.0).clamp(0.05, 0.95);
        let success_chance = base_chance * Self::stamina_factor(&passer.clone());

        let roll = (generate_number_by_range(0, 100) as f32) / 100.0;

        if roll <= success_chance {
            // Successful pass → choose new teammate
            let (team_id, player_id) = Self::select_pass_target(teams, ball_possession);

            // Update possession tentatively
            ball_possession[0] = team_id;
            ball_possession[1] = player_id;

            // Attempt to control the ball
            let control_success = Self::control(teams, ball_possession);

            if control_success {
                // Control successful → update last passer
                last_pass_player[0] = team_id;
                last_pass_player[1] = player_id;
            } else {
                // Receiver failed to control → trigger rebound
                Self::rebound(teams, ball_possession, last_pass_player);
            }
        } else {
            // Pass failed → trigger rebound
            Self::rebound(teams, ball_possession, last_pass_player);
        }

        true // action completed
    }

    pub fn dribble(teams: &mut [Team; 2], ball_possession: &mut [u8; 2]) -> bool {
        let team_id = ball_possession[0] as usize;
        let player_id = ball_possession[1] as usize;

        let attacker = &teams[team_id].players[player_id];

        // Opponent team
        let opponent_team = if team_id == 0 { 1 } else { 0 };

        // Find ideal defender
        let needed_def_pos = Self::matchup_position(&attacker.current_position);

        let defender_index_opt = teams[opponent_team].players
            .iter()
            .enumerate()
            .find(|(_, p)| p.current_position == needed_def_pos)
            .map(|(i, _)| i);

        let defender_index = match defender_index_opt {
            Some(i) => i,
            None =>
                generate_number_by_range(
                    0,
                    (teams[opponent_team].players.len() as u8) - 1
                ) as usize,
        };

        let defender = &teams[opponent_team].players[defender_index];

        // --- DRIBBLE VS DEFENSE ---
        let attacker_score = (attacker.skills.dribbling as i32) + (attacker.skills.speed as i32);
        let defender_score =(defender.skills.defense as i32) + (defender.skills.physical as i32) + (defender.skills.aggression as i32);

        let difficulty = defender_score - attacker_score;

        let dribble_chance = (50 - difficulty).clamp(5, 95);
        let roll = generate_number_by_range(0, 100);

        let success = roll < (dribble_chance as u8);

        // --- CARD CHECK (separate functions) ---
        let red = Self::check_red(defender.skills.aggression);

        if red && !success {
            // REMOVE defender from opponent team
            teams[opponent_team].players.remove(defender_index);

            // If the defender had the ball (on failed dribble), reset possession
            if !success {
                // after removal, we must give ball to another random player
                if !teams[opponent_team].players.is_empty() {
                    let new_player = generate_number_by_range(
                        0,
                        (teams[opponent_team].players.len() as u8) - 1
                    ) as u8;

                    ball_possession[0] = opponent_team as u8;
                    ball_possession[1] = new_player;
                }
            }

            // Team now plays with one less player. No further action needed.
        }

        // --- POSSESSION CHANGE ON FAILURE ---
        if !success {
            ball_possession[0] = opponent_team as u8;
            ball_possession[1] = defender_index as u8;
        }

        success
    }

    pub fn shoot(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        last_pass_player: &mut [u8; 2]
    ) -> bool {
        let team_id = ball_possession[0] as usize;
        let player_id = ball_possession[1] as usize;

        let attacker = &teams[team_id].players[player_id];

        // Attacker stats
        let attack_score = (attacker.skills.shooting as i32) + (attacker.skills.composure as i32);

        // Opponent team
        let opponent_team = if team_id == 0 { 1 } else { 0 };

        // Find goalkeeper of opponent team
        let goalkeeper_index = teams[opponent_team].players
            .iter()
            .enumerate()
            .find(|(_, p)| matches!(p.position, Position::Goalkeeper))
            .map(|(i, _)| i)
            .expect("Opponent team has no goalkeeper!");

        let goalkeeper = &teams[opponent_team].players[goalkeeper_index];

        // Goalkeeper stats
        let gk_score =
            (goalkeeper.skills.handling as i32) +
            (goalkeeper.skills.intuition as i32) +
            (goalkeeper.skills.reflexes as i32);

        // Compute difficulty
        let difficulty = gk_score - attack_score;

        // Base scoring chance: 50%, modified by difficulty
        // Large positive difficulty → harder to score.
        // Clamp between 5% and 85%
        let scoring_chance = (50 - difficulty).clamp(5, 85);

        let roll = generate_number_by_range(0, 100);

        // --- GOAL ---
        if roll < (scoring_chance as u8) {
            return true; // attacker scores
        }

        // Clear last passer
        last_pass_player[0] = 255;
        last_pass_player[1] = 255;

        // --- MISS — GK WINS ---
        // Decide whether it is a corner or rebound
        let outcome = generate_number_by_range(0, 100);

        if outcome < 30 {
            // 30% chance → GK saves but gives corner
            Self::corner(teams, ball_possession, last_pass_player);
        } else {
            // 70% → ball stays in play → rebound battle
            Self::rebound(teams, ball_possession, last_pass_player);
        }

        false
    }

    pub fn advance(teams: &mut [Team; 2], ball_possession: &mut [u8; 2]) -> bool {
        let player = Self::get_player(teams, ball_possession);

        player.current_position = match player.current_position {
            Position::Goalkeeper => Position::Goalkeeper,
            Position::Defender => Position::Defensive_Midfield,
            Position::Left_Back => Position::Left_Midfield,
            Position::Right_Back => Position::Right_Midfield,
            Position::Defensive_Midfield => Position::Midfielder,
            Position::Midfielder => Position::Attacking_Midfield,
            Position::Left_Midfield => Position::Left_Wing,
            Position::Right_Midfield => Position::Right_Wing,
            Position::Attacking_Midfield => Position::Striker,
            Position::Left_Wing => Position::Striker,
            Position::Right_Wing => Position::Striker,
            Position::Striker => Position::Striker,
        };

        true
    }

    pub fn cross(teams: &mut [Team; 2], ball_possession: &mut [u8; 2]) -> bool {
        let crosser = Self::get_player(teams, ball_possession);

        let cross_quality =
            (crosser.skills.crossing as f32) * 0.65 +
            (crosser.skills.vision as f32) * 0.25 +
            (crosser.skills.composure as f32) * 0.1;

        let base_chance = (cross_quality / 100.0).clamp(0.05, 0.9);
        let success_chance = base_chance * Self::stamina_factor(crosser);

        let roll = (generate_number_by_range(0, 100) as f32) / 100.0;

        roll <= success_chance
    }

    pub fn long_pass(teams: &mut [Team; 2], ball_possession: &mut [u8; 2]) -> bool {
        let team_id = ball_possession[0] as usize;
        let passer_index = ball_possession[1] as usize;

        let passer = &teams[team_id].players[passer_index];

        // --- 1. LONG PASS QUALITY ---
        let lp_quality =
            (passer.skills.passing as f32) * 0.55 +
            (passer.skills.vision as f32) * 0.3 +
            (passer.skills.composure as f32) * 0.15;

        let base_chance = (lp_quality / 100.0).clamp(0.03, 0.85);
        let success_chance = base_chance * Self::stamina_factor(passer);

        // --- 2. TARGET SELECTION (WEIGHTED BY DISTANCE IN ARRAY) ---
        let players_len = teams[team_id].players.len();

        let mut weights: Vec<f32> = Vec::new();
        let mut indices: Vec<usize> = Vec::new();

        for i in 0..players_len {
            if i == passer_index {
                continue; // cannot pass to self
            }

            let mut weight = ((passer_index as i32) - (i as i32)).abs() as f32;

            // Goalkeeper gets reduced chance
            if i == 0 {
                weight *= 0.35;
            }

            if weight < 0.5 {
                weight = 0.5; // avoid zero-weight cases
            }

            weights.push(weight);
            indices.push(i);
        }

        // Weighted random selection
        let total_weight: f32 = weights.iter().sum();
        let mut rnd = (generate_number_by_range(0, 100) as f32 / 100.0) * total_weight;

        let mut receiver_index = indices[0];

        for (i, w) in weights.iter().enumerate() {
            if rnd < *w {
                receiver_index = indices[i];
                break;
            }
            rnd -= *w;
        }

        // --- 3. LONG PASS SUCCESS ROLL ---
        let roll = (generate_number_by_range(0, 100) as f32) / 100.0;

        if roll <= success_chance {
            // PASS SUCCESSFUL → update possession
            ball_possession[1] = receiver_index as u8;
            return true;
        }

        // LONG PASS FAILS → ball lost to opponent
        ball_possession[0] = if team_id == 0 { 1 } else { 0 };
        ball_possession[1] = 0; // goalkeeper receives failed long balls

        false
    }

    pub fn control(teams: &mut [Team; 2], ball_possession: &mut [u8; 2]) -> bool {
        let receiver = Self::get_player(teams, ball_possession);

        let ctrl_quality =
            (receiver.skills.control as f32) * 0.6 +
            (receiver.skills.composure as f32) * 0.25 +
            (receiver.skills.physical as f32) * 0.15;

        let base_chance = (ctrl_quality / 100.0).clamp(0.1, 0.95);
        let success_chance = base_chance * Self::stamina_factor(receiver);

        let roll = (generate_number_by_range(0, 100) as f32) / 100.0;

        roll <= success_chance
    }

    pub fn finish(teams: &mut [Team; 2], ball_possession: &mut [u8; 2]) -> bool {
        let shooter = Self::get_player(teams, ball_possession);

        let fin_quality =
            (shooter.skills.finishing as f32) * 0.65 +
            (shooter.skills.composure as f32) * 0.25 +
            (shooter.skills.control as f32) * 0.1;

        let base_chance = (fin_quality / 100.0).clamp(0.02, 0.8);
        let success_chance = base_chance * Self::stamina_factor(shooter);

        let roll = (generate_number_by_range(0, 100) as f32) / 100.0;

        roll <= success_chance
    }

    fn select_pass_target(teams: &mut [Team; 2], ball_possession: &[u8; 2]) -> (u8, u8) {
        use rand_distr::{ Distribution, Normal };
        use rand::Rng;

        let team_id = ball_possession[0] as usize;
        let num_players = teams[team_id].players.len();
        let current_player = ball_possession[1] as f32;

        let std_dev = 1.5; // tweak for tighter/wider selection
        let normal = Normal::new(current_player, std_dev).unwrap();
        let mut rng = rand::thread_rng();
        let mut target;

        loop {
            // Sample from Gaussian
            target = normal.sample(&mut rng).round() as i32;

            // Clamp to valid range
            if target >= 0 && (target as usize) < num_players {
                // Low probability for goalkeeper if current player is not GK
                if target == 0 && current_player != 0.0 {
                    if rng.gen_bool(0.1) {
                        // 10% chance to pass to goalkeeper
                        return (team_id as u8, 0);
                    } else {
                        continue; // resample
                    }
                }

                // Do not allow passing to self
                if (target as u8) != ball_possession[1] {
                    return (team_id as u8, target as u8);
                }
            }
        }
    }

    fn rebound(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        last_pass_player: &mut [u8; 2]
    ) {
        // Clear last passer
        last_pass_player[0] = 255;
        last_pass_player[1] = 255;

        // 50/50 chance → same team or opponent team recovers ball
        let same_team_recovers = generate_number_by_range(0, 100) < 50;

        if same_team_recovers {
            // SAME TEAM RECOVERS
            let team_id = ball_possession[0] as usize;
            let new_player = generate_number_by_range(
                0,
                (teams[team_id].players.len() as u8) - 1
            ) as u8;

            ball_possession[0] = team_id as u8;
            ball_possession[1] = new_player;
        } else {
            // OPPONENT TEAM RECOVERS
            let opponent_team = if ball_possession[0] == 0 { 1 } else { 0 };
            let new_player = generate_number_by_range(
                0,
                (teams[opponent_team].players.len() as u8) - 1
            ) as u8;

            ball_possession[0] = opponent_team as u8;
            ball_possession[1] = new_player;

            Self::reset_position(teams, ball_possession);
        }
    }

    pub fn reset_position(teams: &mut [Team; 2], _ball_possession: &mut [u8; 2]) {
        for team in teams.iter_mut() {
            for player in team.players.iter_mut() {
                player.current_position = player.position.clone();
            }
        }
    }

    fn matchup_position(attacker: &Position) -> Position {
        match attacker {
            Position::Striker => Position::Defender,
            Position::Left_Wing => Position::Right_Back,
            Position::Right_Wing => Position::Left_Back,
            Position::Attacking_Midfield => Position::Defensive_Midfield,
            Position::Midfielder => Position::Midfielder,
            Position::Left_Midfield => Position::Right_Midfield,
            Position::Right_Midfield => Position::Left_Midfield,
            Position::Defensive_Midfield => Position::Attacking_Midfield,
            Position::Left_Back => Position::Right_Wing,
            Position::Right_Back => Position::Left_Wing,
            Position::Defender => Position::Striker,
            Position::Goalkeeper => Position::Striker, // forced challenge
        }
    }

    pub fn check_red(defender_aggression: u8) -> bool {
        let foul_roll = generate_number_by_range(0, 100);
        foul_roll < defender_aggression / 4
    }

    pub fn corner(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        last_pass_player: &mut [u8; 2]
    ) -> bool {
        let attacking_team = ball_possession[0] as usize;
        let defending_team = if attacking_team == 0 { 1 } else { 0 };

        // Extract heights
        let mut atk_heights: Vec<u8> = teams[attacking_team].players
            .iter()
            .map(|p| p.height_cm)
            .collect();

        let mut def_heights: Vec<u8> = teams[defending_team].players
            .iter()
            .map(|p| p.height_cm)
            .collect();

        // Sort descending (tallest first)
        atk_heights.sort_by(|a, b| b.cmp(a));
        def_heights.sort_by(|a, b| b.cmp(a));

        // Take top 5 or fewer
        let atk_top5: f32 =
            atk_heights
                .iter()
                .take(5)
                .map(|h| *h as f32)
                .sum::<f32>() / (atk_heights.len().min(5) as f32);

        let def_top5: f32 =
            def_heights
                .iter()
                .take(5)
                .map(|h| *h as f32)
                .sum::<f32>() / (def_heights.len().min(5) as f32);

        // Height advantage influences scoring
        let height_advantage = atk_top5 - def_top5;

        // Base chance: 20%, modified by height
        let scoring_chance = (height_advantage / 1.8 + 20.0).clamp(2.0, 35.0) as u8;

        let roll = generate_number_by_range(0, 100);

        // --- GOAL ---
        if roll < scoring_chance {
            return true;
        }

        // --- DEFENDER OR GK WINS ---
        let outcome = generate_number_by_range(0, 100);

        if outcome < 40 {
            // 40% → GK catches the ball
            // Possession → defending team GK
            let gk_index = teams[defending_team].players
                .iter()
                .enumerate()
                .find(|(_, p)| matches!(p.position, Position::Goalkeeper))
                .map(|(i, _)| i)
                .unwrap_or(0);

            ball_possession[0] = defending_team as u8;
            ball_possession[1] = gk_index as u8;
        } else {
            // 60% → REBOUND BATTLE INSIDE BOX
            Self::rebound(teams, ball_possession, last_pass_player);
        }

        false
    }
}
