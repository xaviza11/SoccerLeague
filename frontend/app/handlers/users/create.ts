interface CreateUserPayload {
  name: string
  email: string
  password: string
}

interface CreateUserResponse {
  username: string
}

export const handlerCreateUser = async (
  payload: CreateUserPayload
): Promise<CreateUserResponse> => {
  try {
    return await $fetch<CreateUserResponse>('/api/auth/user', {
      method: 'POST',
      body: payload
    })
    
  } catch (error: any) {
    throw error
  }
}
