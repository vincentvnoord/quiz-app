"use client";

import { Input } from "@/components/Input";
import { PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const CreateQuiz = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    return (
        <>
            <div onClick={() => setOpen(false)} className={`inset-0 transition-colors duration-100 ease-in z-20 fixed ${open ? "bg-black/50" : "bg-transparent pointer-events-none"}`}></div>
            <div className="fixed flex justify-end w-full bottom-0 z-20 right-0 p-3 pb-6">
                <motion.div
                    initial={{ padding: 0 }}
                    animate={open ? { padding: 20 } : { padding: 0 }}
                    className={`bg-white z-50 rounded-xl ${open ? "w-full" : "w-auto"}`}>
                    <motion.div
                        className="overflow-hidden"
                        animate={open ? { height: "auto", width: "auto" } : { height: 0, width: 0 }}
                        initial={{ height: 0, width: 0 }}
                    >
                        <div className="pb-6 flex flex-col">
                            <h2 className="text-xl font-bold">New quiz</h2>
                            <Input className="border-b-2 border-black/20" placeholder="Title" label="" error={true} valid={false} />
                        </div>
                    </motion.div>

                    <Buttons open={open} setOpen={setOpen} />

                </motion.div>
            </div>
        </>
    )
}

const Buttons = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
    return (
        <div className="flex justify-end items-center min-w-0 w-auto">
            <motion.div animate={open ? { width: "auto" } : { width: 0 }} initial={{ width: 0 }} className="overflow-hidden flex-grow">
                <div className="pr-2">
                    <button className="bg-positive p-3 rounded-xl text-white font-bold text-lg w-full">
                        Create
                    </button>
                </div>
            </motion.div>
            <button
                onClick={() => setOpen(!open)}
                className={`transition-colors duration-100 ease-in p-3 rounded-xl shadow-lg flex-shrink-0 flex-grow-0 ${open ? "bg-destructive" : "bg-primary"}`}>
                <motion.div initial={{ rotate: 0 }} animate={open ? { rotate: 45 } : { rotate: 0 }}>
                    <PlusIcon className="text-white" size={32} strokeWidth={1} />
                </motion.div>
            </button>
        </div>
    )
}