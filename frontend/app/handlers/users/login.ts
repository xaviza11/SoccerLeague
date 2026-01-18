interface LoginUserPayload {
  email: string;
  password: string;
}

interface LoginUserResponse {
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

export const handlerLogin = async (payload: LoginUserPayload): Promise<LoginUserResponse> => {
  return await $fetch<LoginUserResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
};
