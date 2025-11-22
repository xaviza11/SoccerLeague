use crate::models::game::game::GameReturn;
use crate::models::game::game::Game;
use crate::models::game::team::Team;

pub fn simulate_new_game(teams: [Team; 2]) -> Result<GameReturn, String> {
    Game::create_game(teams)
}
