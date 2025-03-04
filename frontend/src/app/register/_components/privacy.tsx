import { ThumbsUp } from "lucide-react";
import { ErrorMessage } from "./shared";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import Link from "next/link";

export const PrivacyAgreement = () => {
    const { register, watch, formState: { errors, isSubmitting } } = useFormContext();
    const agreed = watch("privacy");
    const error = errors.privacy;
    const errorMessage = error?.message as string | undefined;

    return (
        <div className="w-full flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <div className={`bg-white border-destructive flex justify-center items-center relative rounded-lg w-10 h-10 overflow-hidden ${errorMessage ? "border-b-4" : "border-none"}`}>
                    <input disabled={isSubmitting} {...register("privacy")} className="absolute opacity-0 w-full h-full" type="checkbox" />
                    <motion.div initial={{ scale: 0, rotate: 360 }} animate={agreed ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 360 }} className="w-full h-full flex justify-center items-center">
                        <ThumbsUp strokeWidth={3} className="text-positive" size={20} />
                    </motion.div>
                </div>
                <label className="opacity-80">I have read and agree to the <Link className={`underline text-primary ${isSubmitting && "pointer-events-none"}`} href={"/privacy"}>Privacy Policy</Link></label>
            </div>
            <ErrorMessage errorMessage={errorMessage} />
        </div>
    )
}