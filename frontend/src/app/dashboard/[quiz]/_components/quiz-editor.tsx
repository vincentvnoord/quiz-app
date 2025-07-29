"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizStore } from "../../_stores/quiz-store";
import QuestionEditor from "./question-editor"
import { Loader2, SearchX, Trash2 } from "lucide-react"
import { useEffect, useState } from "react";
import { CreateGame } from "./create-game";
import { LoadedQuiz } from "@/business/entities/quiz";

export const QuizEditor = () => {
  const { quizList } = useQuizStore();
  const params = useParams();
  const quizId = params["quiz"] as string;
  const quiz = quizList.find((quiz) => quiz.id == quizId);

  useEffect(() => {
    if (quiz === undefined) {
      document.title = `Not Found | Quiz Editor`;
      return;
    }

    if (quiz.state === "generating") {
      document.title = `Generating | Quiz Editor`;
      return;
    }
  }, [quiz])

  if (quiz === undefined) {
    return (
      <div className="w-full h-full flex gap-2 flex-col items-center justify-center">
        <SearchX className="" size={64} />
        <p className="text-2xl text-center">Quiz not found</p>
        <p className="text-secondary text-center">Please select a valid quiz from your library or create a new one.</p>
      </div>
    )
  }

  if (quiz.state === "generating") {
    return (
      <div className="w-full h-full flex gap-2 flex-col items-center justify-center">
        <Loader2 className="animate-spin" size={64} />
        <p className="text-secondary text-center">Please wait while we generate your quiz.</p>
      </div>
    )
  }

  document.title = `${quiz.title} | Quiz Editor`;

  return (
    <>
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2 flex-grow">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-shadow-sm mr-6">{quiz.title}</motion.h1>

          <DeleteQuiz quiz={quiz} />
        </div>

        <CreateGame quizId={quizId} />
      </div>

      <QuestionEditor quizId={quizId} />
    </>
  )
}

const DeleteQuiz = ({ quiz }: { quiz: LoadedQuiz }) => {
  const [open, setOpen] = useState(false);

  const { quizList, setQuizList } = useQuizStore();
  const router = useRouter();

  const deleteQuiz = async () => {
    // NEEDS TO DELETE TO SERVER AS WELL
    const filteredList = quizList.filter((q) => q.id !== quiz.id);
    setQuizList(filteredList);
    setOpen(false);
    router.push("/dashboard");
  }

  return (
    <div className="z-30">
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-center justify-center p-3 rounded-full hover:bg-black/10 transition-colors duration-100 ease-in">
        <Trash2 className="text-destructive" size={24} />
      </button>

      <div className={`${open ? "pointer-events-auto" : "pointer-events-none"} flex items-center justify-center inset-0 absolute`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ ease: "backOut", duration: 0.1 }}
          className="bg-white max-w-[450px] gap-4 flex flex-col z-30 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold">Are you sure you want to delete this quiz?</p>
          </div>
          <div className="w-full h-[1px] bg-black/10" />

          <div className="flex flex-col gap-1 mb-6">
            <p className="">{quiz.title}</p>
            <p>{quiz.questions.length} question{quiz.questions.length > 1 && "s"}</p>
          </div>

          <div className="flex justify-between w-full">
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer hover:underline">
              Cancel
            </button>
            <button
              onClick={deleteQuiz}
              className="cursor-pointer bg-destructive flex items-center text-white rounded-lg p-2 px-4 font-bold">
              <Trash2 className="mr-2" size={16} />
              Delete
            </button>
          </div>
        </motion.div>
        <button onClick={() => setOpen(false)} className={`absolute inset-0 transition-colors duration-100 eas-in ${open ? "bg-black/50" : "bg-transparent"}`} />
      </div>
    </div>
  )
}
