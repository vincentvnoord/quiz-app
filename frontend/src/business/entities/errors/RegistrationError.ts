export enum RegistrationErrorType {
    EMAIL_EXISTS = 'EMAIL_EXISTS',
}

export class RegistrationError extends Error {
    public type: RegistrationErrorType;

    constructor(message: string, type: RegistrationErrorType) {
        super(message);
        this.type = type;
    }
}