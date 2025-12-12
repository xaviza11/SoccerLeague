interface UserRegistrationResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserLoginResponse {
    accessToken: string,
    name: string
}

interface UserDeleteOneResponse {

}

interface UserFindByNameResponse {

}

interface UserFindOneResponse {

}

interface UserUpdateResponse {

}

interface UserFindAllResponse {

}

export type { UserRegistrationResponse, UserLoginResponse, UserDeleteOneResponse, UserFindByNameResponse, UserFindOneResponse, UserUpdateResponse, UserFindAllResponse }
