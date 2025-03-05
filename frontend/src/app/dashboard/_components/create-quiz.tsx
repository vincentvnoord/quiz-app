"use client";

import { Input } from "@/components/Input";
import { PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export const CreateQuiz = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="inset-0 z-20 fixed bg-black/50"></div>
            <div className="fixed flex flex-end w-full bottom-0 z-20 right-0 p-3 pb-6">
                <div className={`bg-white z-50 p-3 rounded-xl ${open ? "w-full" : "w-fit"}`}>
                    <motion.div
                        className="overflow-hidden origin-bottom-right"
                        animate={open ? { width: "100%", height: "auto" } : { width: 0, height: 0 }}
                        initial={{ width: 0, height: 0 }}>
                        <div className="w-full pb-6 flex flex-col">
                            <h2 className="text-xl font-bold">Create quiz</h2>
                            <Input className="border-b-2 border-black/20" placeholder="Title" label="" error={true} valid={false} />
                        </div>
                    </motion.div>
                    <div className="flex w-full justify-end items-center">
                        <motion.div animate={open ? { width: "100%" } : { width: 0 }} initial={{ width: 0 }} className="overflow-hidden h-full">
                            <div className="w-full pr-2">
                                <button className="bg-positive p-3 mr-4 rounded-xl text-white font-bold text-lg w-full">
                                    Create
                                </button>
                            </div>
                        </motion.div>
                        <button onClick={() => setOpen(!open)} className="bg-primary p-3 rounded-xl shadow-lg">
                            <PlusIcon className="text-white" size={32} strokeWidth={1} />
                        </button>
                    </div>
                </div >
            </div>
        </>
    )
}