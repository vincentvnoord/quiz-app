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

export { ErrorMessage };