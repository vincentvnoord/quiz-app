import { PlayerGameStore, usePlayerGameStore } from "../stores/player-game-store";

export const setAllPlayerState = (newState: Partial<PlayerGameStore>, store: typeof usePlayerGameStore) => {
    const state = store.getState();
    state.setGameState(newState.gameState ?? state.gameState);

    state.setTitle(state.title ?? state.title);

    state.setQuestionCount(state.questionCount ?? state.questionCount);
    state.setCorrectAnswer(state.correctAnswer ?? -1);
    state.setCurrentQuestion(state.currentQuestion ?? null);

    state.setTimer(state.timer ?? 5);
}