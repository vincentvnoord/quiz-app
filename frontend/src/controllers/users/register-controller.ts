import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(12, "Password must be at least 8 characters"),
    privacy: z.boolean().refine(value => value === true, { message: "Please agree to our privacy policy" }),
});

export const registerUserController = async (req: Request, res: Response) => {

};