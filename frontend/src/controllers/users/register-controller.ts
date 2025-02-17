import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(12, "Password must be at least 8 characters"),
    repeatPassword: z.string().min(1, "Please repeat your password"),
    privacyAgreement: z.boolean(),
});

export const registerUserController = async (req: Request, res: Response) => {

};