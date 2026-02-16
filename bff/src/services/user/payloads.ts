interface ServiceUserRegistrationPayload {
  name: string;
  email: string;
  password: string;
}

interface ServiceUserLoginPayload {
  email: string;
  password: string;
}

export type { ServiceUserRegistrationPayload, ServiceUserLoginPayload };
