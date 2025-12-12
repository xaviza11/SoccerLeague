import { UserClient } from "../apiClients/user.js"
import  type { ServiceUserRegistrationPayload } from "../dto/servicePayloads/users/index.js"

export class UserService {
  private userClient = new UserClient();

  public async registerUser(payload: ServiceUserRegistrationPayload) {
    try {
      const user = await this.userClient.create(payload);
      return user;
    } catch (error) {
      throw error;
    }
  }

}
