import {
  UserClient,
  UsersGameStatsClient,
  SimulatorClient,
  UsersStorageClient,
  TeamsClient,
  PlayerClient,
} from "../modules/apiClients/index.js";
import type {
  ServiceUserRegistrationPayload,
  ServiceUserLoginPayload,
} from "../modules/models/dto/servicePayloads/users/index.js";
import type { CreatePlayerResponse } from "../modules/models/dto/responses/player/index.js";
import { TokenCrypto } from "../modules/common/helpers/encrypt.js";
import {
  AuthError,
  ConflictError,
  ServiceUnavailableError,
  BadRequestError,
} from "../modules/common/errors/index.js";

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
        if (user.message?.includes("Service unavailable")) {
          throw new ServiceUnavailableError(user.message);
        }
        if (user.message?.includes("already in use")) {
          throw new ConflictError(user.message);
        }
        throw new BadRequestError(user.message ?? "Error creating user - 000");
      }

      const login = await this.userClient.login({
        email: payload.email,
        password: payload.password,
      });

      if (!("accessToken" in login))
        throw new AuthError("Error creating user - 001");

      const decryptedToken = login.accessToken;
      if (!decryptedToken)
        throw new ServiceUnavailableError("Error creating user - 002");

      const stats = await this.usersGameStatsClient.createStats(decryptedToken);
      if (!("id" in stats))
        throw new ServiceUnavailableError("Error creating user - 003");

      const storage =
        await this.usersStorageClient.createStorage(decryptedToken);
      if (!("id" in storage))
        throw new ServiceUnavailableError("Error creating user - 004");

      const team = await this.teamsClient.createTeam(decryptedToken);
      if (!("id" in team))
        throw new ServiceUnavailableError("Error creating user - 005");

      const teamPlayers = await this.simulatorClient.generateTeam(55);

      const createdPlayers = await Promise.all(
        teamPlayers.players.map((player) =>
          this.playersClient.createPlayer(decryptedToken, {
            ...player,
            team: { id: team.id },
            isBench: false,
          }),
        ),
      );

      const createdBench = await Promise.all(
        teamPlayers.bench_players.map((player) =>
          this.playersClient.createPlayer(decryptedToken, {
            ...player,
            team: { id: team.id },
            isBench: true,
          }),
        ),
      );

      if (createdPlayers.some((p: any) => !("id" in p))) {
        throw new ServiceUnavailableError("Error creating main players");
      }
      if (createdBench.some((p: any) => !("id" in p))) {
        throw new ServiceUnavailableError("Error creating bench players");
      }

      const allCreated = [...createdPlayers, ...createdBench];

      const validPlayers = allCreated.filter(
        (p): p is CreatePlayerResponse => "id" in p,
      );

      await this.teamsClient.updateTeam(decryptedToken, team.id, {
        players: validPlayers.map((p) => p.id),
      });

      const me = await this.userClient.findMe(decryptedToken);
      if (!("name" in me))
        throw new ServiceUnavailableError("Error creating user - 008");
      if (!("storage" in me))
        throw new ServiceUnavailableError("Error creating user - 009");
      if (!("stats" in me))
        throw new ServiceUnavailableError("Error creating user - 010");
      if (!("has_game" in me))
        throw new ServiceUnavailableError("Error creating user - 011");

      return {
        username: me.name,
        token: TokenCrypto.encrypt(login.accessToken),
        storage: me.storage,
        stats: me.stats,
        has_game: me.has_game,
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
    const user = await this.userClient.login(payload);

    if (!("id" in user)) {
      if ("message" in user) {
        if (user.message?.includes("Service unavailable")) {
          throw new ServiceUnavailableError(user.message);
        }

        if (user.message?.includes("Invalid credentials")) {
          throw new AuthError(user.message);
        }

        throw new BadRequestError(
          user.message ?? "Error on retrieve user - 000",
        );
      }
    }

    if (!("accessToken" in user)) {
      throw new AuthError("Error retrieve user - 001");
    }

    const decryptedToken = user.accessToken;

    const me = await this.userClient.findMe(decryptedToken);
    if (!("name" in me))
      throw new ServiceUnavailableError("Error on retrieve user - 002");
    if (!("storage" in me))
      throw new ServiceUnavailableError("Error on retrieve user - 003");
    if (!("stats" in me))
      throw new ServiceUnavailableError("Error on retrieve user - 004");
    if (!("has_game" in me))
      throw new ServiceUnavailableError("Error on retrieve user - 005");

    return {
      username: me.name,
      token: TokenCrypto.encrypt(user.accessToken),
      storage: me.storage,
      stats: me.stats,
      has_game: me.has_game,
    };
  }
}
