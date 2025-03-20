export type Question = {
    index: number;
    text: string;
    answers: string[];
    timeToAnswer: number;
}

export interface QuestionSlice {
    currentQuestion: Question;
    setCurrentQuestion: (question: Question) => void;
    correctAnswer: number | null;
    setCorrectAnswer: (correctAnswer: number) => void;
}

export const createQuestionSlice = (set: any): QuestionSlice => ({
    currentQuestion: { index: 0, text: "", answers: [], timeToAnswer: 0 },
    setCurrentQuestion: (question) => set({ currentQuestion: question }),

    correctAnswer: null,
    setCorrectAnswer: (correctAnswer) => set({ correctAnswer }),
});