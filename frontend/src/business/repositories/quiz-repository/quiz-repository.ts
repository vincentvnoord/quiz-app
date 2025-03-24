import { QuizDisplay } from "@/business/entities/quiz";

export const IQuizRepository = Symbol.for("IQuizRepository");

export interface IQuizRepository {
    getList(): Promise<QuizDisplay[]>;
}