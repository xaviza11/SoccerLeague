interface LoginUserPayload {
  email: string;
  password: string;
}

interface LoginUserResponse {
  username: string;
}

export const handlerLogin = async (payload: LoginUserPayload): Promise<LoginUserResponse> => {
  return await $fetch<LoginUserResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
};
