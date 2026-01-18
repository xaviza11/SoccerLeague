interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  username: string;
  token: string;
  storage: {id: string};
  stats: {
    id: string;
    elo: number;
    money: number;
    total_games: number;
  }
}

export const handlerCreateUser = async (
  payload: CreateUserPayload,
): Promise<CreateUserResponse> => {
  return await $fetch<CreateUserResponse>("/api/auth/user", {
    method: "POST",
    body: payload,
  });
};
