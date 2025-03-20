
export interface GameSlice {
    gameCode: string;
    setGameCode: (gameCode: string) => void;

    title: string;
    setTitle: (title: string) => void;

    questionCount: number;
    setQuestionCount: (questionCount: number) => void;

    timer: number;
    setTimer: (timer: number) => void;
}

export const createGameSlice = (set: any): GameSlice => ({
    gameCode: "",
    setGameCode: (gameCode) => set({ gameCode }),

    title: "",
    setTitle: (title) => set({ title }),

    questionCount: 0,
    setQuestionCount: (questionCount) => set({ questionCount }),

    timer: 5,
    setTimer: (timer) => { set({ timer }) },
});