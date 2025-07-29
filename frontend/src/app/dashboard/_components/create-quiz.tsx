"use client"

import { useRouter } from "next/navigation"
import { CreateQuizButton } from "./create-quiz-button"
import { File, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useQuizStore } from "../_stores/quiz-store"

export default function CreateQuiz() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const { addQuiz } = useQuizStore();

  const handleCreateFromBlank = () => {
    const quizId = crypto.randomUUID();
    setVisible(false);

    addQuiz({
      id: quizId.toString(),
      title: "New Quiz",
      questions: [],
      state: "loaded",
    })

    setTimeout(() => {
      router.push(`/dashboard/${quizId}`);
    }, 200);
  }

  const handleCreateWithAIClick = () => {
    setVisible(false);

    setTimeout(() => {
      router.push("/dashboard/create");
    }, 200);
  }

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -100 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 }}
        className="text-5xl font-semibold text-shadow-sm">
        How do you want to create?
      </motion.h1>
      <div className="grid grid-cols-2 gap-4 place-items-center">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          className="w-full"
          animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
        >
          <CreateQuizButton onClick={handleCreateFromBlank}>
            <File className="" size={64} />
            <p className="w-full text-center">Empty quiz</p>
          </CreateQuizButton>
        </motion.div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: 100 }}
          animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
        >
          <CreateQuizButton onClick={handleCreateWithAIClick}>
            <Sparkles className="" size={64} />

            <p className="text-center w-full">Generate with AI</p>
          </CreateQuizButton>
        </motion.div>
      </div>
    </>
  )
}
