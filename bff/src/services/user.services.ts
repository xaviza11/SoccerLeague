import {
  UserClient,
  UsersGameStatsClient,
  SimulatorClient,
  UsersStorageClient,
  TeamsClient,
  PlayerClient,
} from "../apiClients/index.js";
import type {
  ServiceUserRegistrationPayload,
  ServiceUserLoginPayload,
} from "../dto/servicePayloads/users/index.js";
import type { CreatePlayerResponse } from "../dto/responses/player/index.js";
import { TokenCrypto } from "../helpers/encrypt.js";
import {
  AuthError,
  ConflictError,
  NotFoundError,
  ServiceUnavailableError,
  ValidationError,
} from "../errors/index.js";

export class UserService {
  private userClient = new UserClient();
  private usersGameStatsClient = new UsersGameStatsClient();
  private simulatorClient = new SimulatorClient();
  private usersStorageClient = new UsersStorageClient();
  private teamsClient = new TeamsClient();
  private playersClient = new PlayerClient();

  private token = "";
  private currentPassword = "";

  public async registerUser(payload: ServiceUserRegistrationPayload) {
    try {
      const user = await this.userClient.create(payload);
      this.currentPassword = payload.password;

      if (!("id" in user)) {
        return new ConflictError(user.message ?? "Error creating user - 000");
      }

      const login = await this.userClient.login({
        email: payload.email,
        password: payload.password,
      });

      if (!("accessToken" in login)) {
        return new AuthError("Error creating user - 0001");
      }

      const decryptedToken = login.accessToken;

      if (!decryptedToken) {
        throw new ServiceUnavailableError("Error creating user - 002");
      }

      await this.usersGameStatsClient.createStats(decryptedToken);
      await this.usersStorageClient.createStorage(decryptedToken);

      const team = await this.teamsClient.createTeam(decryptedToken);

      if (!("id" in team)) {
        throw new ServiceUnavailableError("Error creating user - 003");
      }

      const teamPlayers = await this.simulatorClient.generateTeam(55);

      const createdPlayers = await Promise.all(
        teamPlayers.players.map((player) =>
          this.playersClient.createPlayer(decryptedToken, {
            ...player,
            team: { id: team.id },
          })
        )
      );

      if (createdPlayers.some((p) => !("id" in p))) {
        throw new ServiceUnavailableError("Error creating user - 004");
      }

      const validPlayers = createdPlayers.filter(
        (p): p is CreatePlayerResponse => "id" in p
      );

      if (validPlayers.length !== createdPlayers.length) {
        throw new ServiceUnavailableError("Error creating user - 005");
      }

      const playerIds = validPlayers.map((p) => p.id);

      await this.teamsClient.updateTeam(decryptedToken, team.id, {
        players: playerIds,
      });

      return {
        username: login.name,
        token: login.accessToken,
      };
    } catch (error) {
      if (this.currentPassword && this.token) {
        await this.userClient.deleteOne(this.token, {
          currentPassword: this.currentPassword,
        });
      }
      throw error;
    }
  }

  public async login(payload: ServiceUserLoginPayload) {
    try {
      const user = await this.userClient.login(payload);

      if (!("accessToken" in user)) {
        throw new AuthError(user.message ?? "Invalid email or password");
      }

      TokenCrypto.encrypt(user.accessToken);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
