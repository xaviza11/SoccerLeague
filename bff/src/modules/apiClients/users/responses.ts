import type Player from "../../models/interfaces/player.js";

interface UserRegistrationResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserLoginResponse {
  accessToken: string;
  name: string;
}

interface UserDeleteOneResponse {}

interface UserFindByNameResponse {}

interface UserFindOneResponse {
  id: string;
  name: string;
  email: string;
  storage: { id: string, team: { id: string, players: Player[] } };
  stats: { id: string; elo: number; money: number; total_games: number };
  has_game: boolean;
}

interface UserUpdateResponse {}

interface UserFindAllResponse {
  
}

export type {
  UserRegistrationResponse,
  UserLoginResponse,
  UserDeleteOneResponse,
  UserFindByNameResponse,
  UserFindOneResponse,
  UserUpdateResponse,
  UserFindAllResponse,
};
