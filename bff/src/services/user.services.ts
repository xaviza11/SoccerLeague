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
        throw new Error("User registration failed");
      }

      const login = await this.userClient.login({
        email: payload.email,
        password: payload.password,
      });

      if ("accessToken" in login === false) {
        throw new Error("User registration or login failed");
      }

      const decryptedToken = TokenCrypto.decrypt(login.accessToken);
      this.token = decryptedToken;

      if (!decryptedToken) {
        throw new Error("Token decryption failed");
      }

      const stats = await this.usersGameStatsClient.createStats(decryptedToken);

      const storage = await this.usersStorageClient.createStorage(
        decryptedToken
      );

      const team = await this.teamsClient.createTeam(decryptedToken);

      if (!("id" in team)) {
        throw new Error(
          `Team creation failed ${JSON.stringify(team, null, 2)}`
        );
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
        throw new Error("Player creation failed");
      }
      const validPlayers = createdPlayers.filter(
        (p): p is CreatePlayerResponse => "id" in p
      );

      if (validPlayers.length !== createdPlayers.length) {
        throw new Error("Some players failed to be created");
      }

      const playerIds = validPlayers.map((p) => p.id);

      const updatedTeam = await this.teamsClient.updateTeam(
        decryptedToken,
        team.id,
        {
          players: playerIds,
        }
      );

      return { username: login.name, token: login.accessToken };
    } catch (error) {
      if (this.currentPassword && this.token) {
        await this.userClient.deleteOne(this.token, {currentPassword: this.currentPassword});
      }
      throw error;
    }
  }

  public async login(payload: ServiceUserLoginPayload) {
    try {
      const user = await this.userClient.login(payload);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
