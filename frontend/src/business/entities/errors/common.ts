import { ZodError } from "zod";

export class InputParseError extends Error {
    errors: { path: string; message: string }[];

    constructor(message: string, zodError?: ZodError) {
        super(message);

        this.errors = zodError
            ? zodError.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }))
            : [];
    }
}

export class UnAuthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}