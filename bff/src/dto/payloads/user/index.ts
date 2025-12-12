interface UserRegistrationPayload {
    name: string;
    email: string;
    password: string;
}

interface UserLoginPayload {
    email: string;
    password: string;
}

interface UserUpdatePayload {}

interface UserFindOnePayload {
    id: string;
}

interface UserFindByNamePayload {
    name: string;
}

interface UserDeleteOnePayload {}

export type {
    UserRegistrationPayload,
    UserLoginPayload,
    UserFindByNamePayload,
    UserFindOnePayload,
    UserDeleteOnePayload,
    UserUpdatePayload
};
