interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  username: string;
}

export const handlerCreateUser = async (
  payload: CreateUserPayload,
): Promise<CreateUserResponse> => {
  return await $fetch<CreateUserResponse>("/api/auth/user", {
    method: "POST",
    body: payload,
  });
};
