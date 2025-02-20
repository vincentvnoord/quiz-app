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