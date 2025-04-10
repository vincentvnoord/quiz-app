import React from "react";

const Input = React.forwardRef<HTMLInputElement, { label?: string, error: boolean, valid: boolean } & React.ComponentProps<"input">>(
    ({ className, type, label, children, error, valid, ...props }, ref) => {

        return (
            <div className="flex z-20 flex-col w-full justify-center">
                <label className="pl-2 opacity-50 font-bold" htmlFor={props.name}>{label}</label>
                <div className={`bg-white flex rounded-lg w-full items-center border-destructive ${!valid && !error ? "border-0" : "border-b-4"} ${className}`}>
                    <input ref={ref} className="bg-transparent rounded-lg p-3 py-4 focus:outline-hidden w-full" type={type} {...props} />
                    {children}
                </div>
            </div>
        )
    }
);
Input.displayName = "Input";

export { Input };