import React from 'react'
import { useFormContext } from 'react-hook-form';
import { Check, XIcon, Eye, EyeOffIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './shared';

export const PasswordInput = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const { watch, register, formState: { errors, isSubmitting } } = useFormContext();
    const error = errors.password;
    const errorMessage = error?.message;

    const pw = watch("password");

    return (
        <div className="w-full flex flex-col gap-1">
            <Input disabled={isSubmitting} className="z-50" valid={false} error={errorMessage !== undefined} {...register("password")} label="Password" type={showPassword ? "text" : "password"}>
                <div onClick={() => setShowPassword(!showPassword)} className="pr-3 opacity-50">
                    {
                        showPassword ?
                            <Eye className="" size={28} />
                            :
                            <EyeOffIcon className="" size={28} />
                    }
                </div>
            </Input>
            <motion.div initial={{ height: 0 }} transition={errorMessage ? { delay: 0 } : { delay: 0.5 }} animate={errorMessage ? { height: "auto" } : { height: 0 }} className="flex items-center overflow-hidden">
                <PasswordCorrectness isCorrect={pw?.length > 12} />
                <p className="text-sm p-2 opacity-80">Minimum 12 characters</p>
            </motion.div>
        </div>
    )
}

const PasswordCorrectness = ({ isCorrect }: { isCorrect: boolean }) => {
    return (
        <div className="flex items-center w-8 h-8">
            {isCorrect ? <Check size={32} className="text-positive pr-2" /> : <XIcon size={28} className="text-destructive" />}
        </div>
    )
}