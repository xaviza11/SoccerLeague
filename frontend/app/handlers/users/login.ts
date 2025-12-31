interface LoginUserPayload {
  email: string
  password: string
}

interface LoginUserResponse {
  username: string
}

export const handlerLogin = async (
  payload: LoginUserPayload
): Promise<LoginUserResponse> => {
  try {
    return await $fetch<LoginUserResponse>('/api/auth/login', {
      method: 'POST',
      body: payload
    })
    
  } catch (error: any) {
    throw error
  }
}
