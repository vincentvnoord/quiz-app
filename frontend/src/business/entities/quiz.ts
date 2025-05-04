type BaseQuiz = {
    id: string;
};

export type Quiz = GeneratingQuiz | LoadedQuiz;

export type GeneratingQuiz = BaseQuiz & {
    state: "generating";
}

export type LoadedQuiz = BaseQuiz & {
    state: "loaded";
    title: string;
    questions: Question[];
}

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