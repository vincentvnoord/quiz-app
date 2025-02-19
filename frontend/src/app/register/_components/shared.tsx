import { motion } from "framer-motion";
import React from "react";

const ErrorMessage = ({ errorMessage }: { errorMessage: string | undefined }) => {

    return (
        <motion.p
            className="overflow-hidden text-destructive pl-2"
            animate={errorMessage ? { height: "auto" } : { height: 0 }}
            initial={{ height: 0 }}>
            {errorMessage}
        </motion.p>
    )
}

const Input = React.forwardRef<HTMLInputElement, { label: string, error: boolean, valid: boolean } & React.ComponentProps<"input">>(
    ({ className, type, label, children, error, valid, ...props }, ref) => {

        return (
            <div className="flex z-20 flex-col w-full justify-center">
                <label className="pl-2 opacity-50 font-bold" htmlFor={props.name}>{label}</label>
                <div className={`bg-white flex rounded-lg w-full items-center ${!valid && !error ? "border-0" : "border-b-4"} border-destructive`}>
                    <input ref={ref} className="bg-transparent rounded-lg p-3 py-4 focus:outline-none w-full" type={type} {...props} />
                    {children}
                </div>
            </div>
        )
    }
);
Input.displayName = "Input";

export { Input, ErrorMessage };