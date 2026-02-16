interface UserRegistrationPayload {
  name: string;
  email: string;
  password: string;
}

interface UserLoginPayload {
  email: string;
  password: string;
}

interface UserUpdatePayload {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  currentPassword: string;
}

interface UserFindOnePayload {
  id: string;
}

interface UserFindByNamePayload {
  name: string;
}

interface UserDeleteOnePayload {
  currentPassword: string;
}

interface FindAllPayload {
  page: number,
  pageSize: number
}

export type {
  UserRegistrationPayload,
  UserLoginPayload,
  UserFindByNamePayload,
  UserFindOnePayload,
  UserDeleteOnePayload,
  UserUpdatePayload,
  FindAllPayload
};
