import { useState } from "react";
import useHostStore from "@/client/quiz-game/host/stores/host-store";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";


export const CloseLobbyButton = () => {
    const [closing, setClosing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { gameManager } = useHostStore();

    const exitModal = () => {
        if (!closing) {
            setIsModalOpen(false);
        }
    }

    const closeLobby = async () => {
        setClosing(true);
        await gameManager?.closeLobby();
    }

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="p-3 h-fit hover:bg-black/20 rounded-lg transition-colors duartion-100 ease-in opacity-50">Close lobby</button>
            <div
                className={`inset-0 p-2 flex justify-center items-center fixed top-0 left-0 ${isModalOpen ? "pointer-events-auto" : "pointer-events-none"}`}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isModalOpen ? { opacity: 1 } : { opacity: 0 }}
                    onClick={exitModal} className="w-full absolute h-full bg-black/20 backdrop-blur-sm"></motion.div>

                <motion.div
                    animate={isModalOpen ? { opacity: 1, translateY: 0 } : { opacity: 0, translateY: 100 }}
                    initial={{ translateY: 100, opacity: 0 }}
                    className="bg-white relative z-20 p-3 rounded-lg">
                    <motion.div
                        animate={closing ? { opacity: 0 } : { opacity: 1 }}
                        initial={{ opacity: 1 }}
                        className={`flex flex-col gap-2 w-full h-full ${closing ? "pointer-events-none" : "pointer-events-auto"}`}>
                        <p className="text-lg font-bold">Are you sure you want to close the game lobby?</p>
                        <p className="opacity-60">This will remove all players and erase the game</p>
                        <div className="flex gap-2 text-destructive items-center pt-3">
                            <AlertCircle size={24} />
                            <p className="text-destructive">Players will not be able to reconnect</p>
                        </div>

                        <div className={`flex justify-between gap-2 pt-4 ${isModalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                            <button
                                onClick={exitModal}
                                className="p-2 hover:opacity-100 hover:underline">
                                Cancel
                            </button>

                            <button
                                onClick={closeLobby}
                                className={`bg-destructive text-white p-3 rounded-lg font-semibold`}>
                                Confirm and close
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={closing ? { opacity: 1 } : { opacity: 0 }}
                        className="absolute pointer-events-none top-0 right-0 w-full h-full flex flex-col gap-2 justify-center items-center">
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <RefreshCw
                                size={64}
                                fill="transparent"
                                strokeWidth={1.5}
                            />
                        </motion.div>
                        <p className="text-lg font-bold">Closing lobby...</p>
                        <p className="opacity-60">
                            Sending you back to dashboard
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </>
    )
}