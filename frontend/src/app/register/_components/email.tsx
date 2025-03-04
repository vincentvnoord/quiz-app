import { Input } from "@/components/Input";
import { ErrorMessage } from "./shared";
import { useFormContext } from "react-hook-form";

export const EmailInput = () => {
    const { register, formState: { errors, isSubmitting } } = useFormContext();
    const error = errors.email;
    const errorMessage = error?.message as string | undefined;

    return (
        <div className="w-full flex flex-col gap-1">
            <Input disabled={isSubmitting} valid={false} error={errorMessage !== undefined} {...register("email")} label="Email" type="email" />
            <ErrorMessage errorMessage={errorMessage} />
        </div>
    )
}