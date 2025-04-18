
export type QuizDisplay = {
    id: string;
    title: string;
    questionCount: number;
}

export type Question = {
    id: string;
    text: string;
    answers: Answer[];
}

export type Answer = {
    id: string;
    text: string;
    isCorrect: boolean;
};