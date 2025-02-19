import { motion } from "framer-motion";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function SuccessMessage({ success }: { success: boolean }) {

    return (
        <div className={`w-full h-full flex justify-center items-center absolute top-0 left-0 ${success ? "" : "pointer-events-none"}`}>
            <div className="flex flex-col gap-2 items-center p-3">
                <motion.div transition={{ delay: 0.5 }} initial={{ scale: 0, rotate: 360 }} animate={success ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 360 }}>
                    <CircleCheckBig className="text-positive" size={100} />
                </motion.div>
                <motion.div transition={{ delay: 0.8 }} initial={{ opacity: 0, translateY: 20 }} animate={success ? { opacity: 1, translateY: 0 } : { opacity: 0, translateY: 20 }} className="flex flex-col gap-2 items-center">
                    <p className="text-xl text-center font-bold">You have successfully registered!</p>
                </motion.div>
                <motion.div transition={{ delay: 0.9 }} initial={{ opacity: 0, translateY: 20 }} animate={success ? { opacity: 1, translateY: 0 } : { opacity: 0, translateY: 20 }} className="flex flex-col gap-2 items-center">
                    <span className="text-base">
                        You can safely {" "}
                        <Link className="underline text-primary" href="/login">login to your account</Link>
                    </span>
                </motion.div>
            </div>
        </div>
    )
}