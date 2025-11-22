use crate::models::game::team::Team;
use crate::models::player::player::Player;
use crate::models::player::position::Position;
use crate::models::game::game_result::GameResult;
use crate::models::game::log::Log;
use crate::utils::generate_random_number::generate_number_by_range;
use rand::prelude::*;
use rand_distr::{ Normal, Distribution };

#[derive(Debug, Clone)]
pub struct Actions;

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
        last_pass_player: &mut [u8; 2],
        logs: &mut Vec<Log>,
        minute: u8
    ) -> bool {
        // Current ball holder
        let passer =
            teams[ball_possession[0] as usize].players[ball_possession[1] as usize].clone();

        let passer_team = ball_possession[0] as usize;

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

            logs.push(Log {
                player_name: passer.name.clone(),
                player_number: passer.number,
                minute,
                team_name: teams[passer_team].name.clone(),
                description: "success.pass".to_string(),
            });

            // Update possession tentatively
            ball_possession[0] = team_id;
            ball_possession[1] = player_id;

            // Attempt to control the ball
            let control_success = Self::control(teams, ball_possession, logs, minute);

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
            logs.push(Log {
                player_name: passer.name.clone(),
                player_number: passer.number,
                minute,
                team_name: teams[passer_team].name.clone(),
                description: "failed.pass".to_string(),
            });
            Self::rebound(teams, ball_possession, last_pass_player);
        }

        true // action completed
    }

    pub fn dribble(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        logs: &mut Vec<Log>,
        minute: u8
    ) -> bool {
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
        let defender_score =
            (defender.skills.defense as i32) +
            (defender.skills.physical as i32) +
            (defender.skills.aggression as i32);

        let difficulty = defender_score - attacker_score;

        let dribble_chance = (50 - difficulty).clamp(5, 95);
        let roll = generate_number_by_range(0, 100);

        let success = roll < (dribble_chance as u8);

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
        last_pass_player: &mut [u8; 2],
        logs: &mut Vec<Log>,
        minute: u8,
        game_result: &mut GameResult
    ) -> bool {
        let team_id = ball_possession[0] as usize;
        let player_id = ball_possession[1] as usize;

        let attacker = &teams[team_id].players[player_id];

        // Attacker stats
        let attack_score = (attacker.skills.shooting as i32) + (attacker.skills.composure as i32);

        // Opponent team
        let opponent_team = if team_id == 0 { 1 } else { 0 };

        // Find goalkeeper
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

        // Compute scoring chance
        let difficulty = gk_score - attack_score;
        let scoring_chance = (50 - difficulty).clamp(5, 85);

        let roll = generate_number_by_range(0, 100);

        if roll < (scoring_chance as u8) {
            // --- GOAL ---
            logs.push(Log {
                player_name: attacker.name.clone(),
                player_number: attacker.number,
                minute,
                team_name: teams[team_id].name.clone(),
                description: "goal.shoot".to_string(),
            });

            println!("GOAL by {}, {}!", attacker.name, teams[team_id].name);
            game_result.score[team_id] += 1;

            // Clear last passer
            last_pass_player[0] = 255;
            last_pass_player[1] = 255;

            // Give ball to opponent goalkeeper (kickoff)
            ball_possession[0] = opponent_team as u8;
            ball_possession[1] = goalkeeper_index as u8;

            return true;
        }

        // Clear last passer
        last_pass_player[0] = 255;
        last_pass_player[1] = 255;

        // Decide if rebound or corner
        let outcome = generate_number_by_range(0, 100);

        if outcome < 30 {
            // GK saves → corner
            logs.push(Log {
                player_name: attacker.name.clone(),
                player_number: attacker.number,
                minute,
                team_name: teams[team_id].name.clone(),
                description: "corner.shoot".to_string(),
            });

            Self::corner(teams, ball_possession, last_pass_player, logs, minute, game_result);
        } else {
            // Ball stays in play → rebound
            logs.push(Log {
                player_name: attacker.name.clone(),
                player_number: attacker.number,
                minute,
                team_name: teams[team_id].name.clone(),
                description: "failed.shoot".to_string(),
            });

            Self::rebound(teams, ball_possession, last_pass_player);
        }

        true
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

    pub fn cross(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        logs: &mut Vec<Log>,
        minute: u8
    ) -> bool {
        let crosser = Self::get_player(teams, ball_possession);

        let cross_quality =
            (crosser.skills.crossing as f32) * 0.65 +
            (crosser.skills.vision as f32) * 0.25 +
            (crosser.skills.composure as f32) * 0.1;

        let base_chance = (cross_quality / 100.0).clamp(0.05, 0.9);
        let success_chance = base_chance * Self::stamina_factor(crosser);

        let roll = (generate_number_by_range(0, 100) as f32) / 100.0;

        let success = roll <= success_chance;

        // --- LOGGING ---
        logs.push(Log {
            player_name: crosser.name.clone(),
            player_number: crosser.number,
            minute,
            team_name: teams[ball_possession[0] as usize].name.clone(),
            description: if success {
                "success.cross".to_string()
            } else {
                "failed.cross".to_string()
            },
        });

        success
    }

    pub fn long_pass(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        logs: &mut Vec<Log>,
        minute: u8,
        last_pass_player: &mut [u8; 2]
    ) -> bool {
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

        // --- 2. TARGET SELECTION ---
        let players_len = teams[team_id].players.len();

        let mut weights: Vec<f32> = Vec::new();
        let mut indices: Vec<usize> = Vec::new();

        for i in 0..players_len {
            if i == passer_index {
                continue;
            }

            let mut weight = ((passer_index as i32) - (i as i32)).abs() as f32;

            if i == 0 {
                weight *= 0.35;
            }

            if weight < 0.5 {
                weight = 0.5;
            }

            weights.push(weight);
            indices.push(i);
        }

        let total_weight: f32 = weights.iter().sum();
        let mut rnd = ((generate_number_by_range(0, 100) as f32) / 100.0) * total_weight;

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
        let success = roll <= success_chance;

        if success {
            // Update possession
            ball_possession[1] = receiver_index as u8;

            logs.push(Log {
                player_name: passer.name.clone(),
                player_number: passer.number,
                minute,
                team_name: teams[team_id].name.clone(),
                description: "success.long_pass".to_string(),
            });

            // Player must control the long pass
            let control_success = Self::control(teams, ball_possession, logs, minute);

            if control_success {
                last_pass_player[0] = team_id as u8;
                last_pass_player[1] = receiver_index as u8;
            }

            // If control fails, rebound() is automatically handled by control()
            return true;
        }

        // --- LONG PASS FAILS ---
        ball_possession[0] = if team_id == 0 { 1 } else { 0 };
        ball_possession[1] = 0;

        logs.push(Log {
            player_name: passer.name.clone(),
            player_number: passer.number,
            minute,
            team_name: teams[team_id].name.clone(),
            description: "failed.long_pass".to_string(),
        });

        false
    }

    pub fn control(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        logs: &mut Vec<Log>,
        minute: u8
    ) -> bool {
        let receiver = Self::get_player(teams, ball_possession);

        // --- CONTROL QUALITY CALCULATION ---
        let control_quality =
            (receiver.skills.control as f32) * 0.6 +
            (receiver.skills.composure as f32) * 0.25 +
            (receiver.skills.physical as f32) * 0.15;

        let base_chance = (control_quality / 100.0).clamp(0.1, 0.95);
        let success_chance = base_chance * Self::stamina_factor(receiver);

        let roll = (generate_number_by_range(0, 100) as f32) / 100.0;
        let success = roll <= success_chance;

        // --- LOG CONTROL ATTEMPT ---
        logs.push(Log {
            player_name: receiver.name.clone(),
            player_number: receiver.number,
            minute,
            team_name: teams[ball_possession[0] as usize].name.clone(),
            description: if success {
                "success.control".to_string()
            } else {
                "failed.control".to_string()
            },
        });

        if success {
            // The player successfully controls the ball.
            return true;
        }

        // --- FAILED CONTROL: TRIGGER REBOUND ---
        Self::rebound(teams, ball_possession, &mut [0u8; 2]);

        false
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

    pub fn penalty(
        teams: &mut [Team; 2],
        ball_possession: &mut [u8; 2],
        last_pass_player: &mut [u8; 2],
        logs: &mut Vec<Log>,
        minute: u8,
        game_result: &mut GameResult
    ) -> bool {
        let team_id = ball_possession[0] as usize;
        let player_id = ball_possession[1] as usize;

        let opponent_team = if team_id == 0 { 1 } else { 0 };

        let shooter = &teams[team_id].players[player_id];

        let gk_index = teams[opponent_team].players
            .iter()
            .enumerate()
            .find(|(_, p)| matches!(p.position, Position::Goalkeeper))
            .map(|(i, _)| i)
            .unwrap_or(0);

        let goalkeeper = &teams[opponent_team].players[gk_index];

        // --- Shooter & GK ability ---
        let shoot_value =
            (shooter.skills.finishing as f32) * 0.6 + (shooter.skills.composure as f32) * 0.4;
        let gk_value =
            (goalkeeper.skills.intuition as f32) * 0.4 +
            (goalkeeper.skills.handling as f32) * 0.3 +
            (goalkeeper.skills.reflexes as f32) * 0.3;

        let mut score_chance = 0.6 + (shoot_value - gk_value) * 0.01;
        let mut rebound_chance = 0.15 + (gk_value - shoot_value) * 0.005;

        score_chance = score_chance.clamp(0.05, 0.9);
        rebound_chance = rebound_chance.clamp(0.05, 0.3);

        let score_pct = (score_chance * 100.0).round() as i32;
        let rebound_pct = (rebound_chance * 100.0).round() as i32;
        let mut corner_pct = (100 - score_pct - rebound_pct).max(5);

        let roll = generate_number_by_range(0, 100);

        if roll < (score_pct as u8) {
            // --- GOAL ---
            logs.push(Log {
                player_name: shooter.name.clone(),
                player_number: shooter.number,
                minute,
                team_name: teams[team_id].name.clone(),
                description: "goal.penalty".to_string(),
            });
 
            last_pass_player[0] = 255;
            last_pass_player[1] = 255;

            // possession to opponent GK
            ball_possession[0] = opponent_team as u8;
            ball_possession[1] = gk_index as u8;

            true
        } else if roll < (score_pct as u8) + (rebound_pct as u8) {
            // --- REBOUND ---
            logs.push(Log {
                player_name: shooter.name.clone(),
                player_number: shooter.number,
                minute,
                team_name: teams[team_id].name.clone(),
                description: "rebound.penalty".to_string(),
            });

            Self::rebound(teams, ball_possession, last_pass_player);
            false
        } else {
            // --- CORNER ---
            logs.push(Log {
                player_name: shooter.name.clone(),
                player_number: shooter.number,
                minute,
                team_name: teams[team_id].name.clone(),
                description: "corner.penalty".to_string(),
            });

            Self::corner(teams, ball_possession, last_pass_player, logs, minute, game_result)
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
        last_pass_player: &mut [u8; 2],
        logs: &mut Vec<Log>,
        minute: u8,
        game_result: &mut GameResult
    ) -> bool {
        let attacking_team = ball_possession[0] as usize;
        let defending_team = if attacking_team == 0 { 1 } else { 0 };

        //? wold be nice to take the corner kicker form the instructions of the player
        last_pass_player[0] = attacking_team as u8;
        last_pass_player[1] = 7;

        // Extract heights
        let mut atk_heights: Vec<u8> = teams[attacking_team].players
            .iter()
            .map(|p| p.height_cm)
            .collect();

        let mut def_heights: Vec<u8> = teams[defending_team].players
            .iter()
            .map(|p| p.height_cm)
            .collect();

        atk_heights.sort_by(|a, b| b.cmp(a));
        def_heights.sort_by(|a, b| b.cmp(a));

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

        let height_advantage = atk_top5 - def_top5;

        let scoring_chance = (height_advantage / 1.8 + 30.0).clamp(2.0, 6.0) as u8;

        let roll = generate_number_by_range(0, 100);

        // --- GOAL ---
        if roll < scoring_chance {
            if last_pass_player[0] != 255 {
                let shooter =&teams[last_pass_player[0] as usize].players[last_pass_player[1] as usize];
                logs.push(Log {
                    player_name: shooter.name.clone(),
                    player_number: shooter.number,
                    minute,
                    team_name: teams[attacking_team].name.clone(),
                    description: "goal.corner".to_string(),
                });

                game_result.score[attacking_team] += 1;
                println!("GOAL from CORNER by {}, {}!", shooter.name, teams[attacking_team].name);
            }
            return true;
        }

        // --- DEFENDER OR GK WINS ---
        let outcome = generate_number_by_range(0, 100);

        if outcome < 40 {
            // 40% → GK catches the ball
            let gk_index = teams[defending_team].players
                .iter()
                .enumerate()
                .find(|(_, p)| matches!(p.position, Position::Goalkeeper))
                .map(|(i, _)| i)
                .unwrap_or(0);

            ball_possession[0] = defending_team as u8;
            ball_possession[1] = gk_index as u8;

            if last_pass_player[0] != 255 {
                let shooter =
                    &teams[last_pass_player[0] as usize].players[last_pass_player[1] as usize];
                logs.push(Log {
                    player_name: shooter.name.clone(),
                    player_number: shooter.number,
                    minute,
                    team_name: teams[attacking_team].name.clone(),
                    description: "saved.corner".to_string(),
                });
            }
        } else {
            // 60% → REBOUND BATTLE
            if last_pass_player[0] != 255 {
                let shooter =
                    &teams[last_pass_player[0] as usize].players[last_pass_player[1] as usize];
                logs.push(Log {
                    player_name: shooter.name.clone(),
                    player_number: shooter.number,
                    minute,
                    team_name: teams[attacking_team].name.clone(),
                    description: "rebound.corner".to_string(),
                });
            }
            Self::rebound(teams, ball_possession, last_pass_player);
        }

        false
    }
}
