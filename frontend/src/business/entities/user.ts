export type User = {
    id: string;
    email: string;
}

export type UserDto = {
    email: string;
    password: string;
}

export type UserLoginDto = {
    email: string;
    password: string;
}