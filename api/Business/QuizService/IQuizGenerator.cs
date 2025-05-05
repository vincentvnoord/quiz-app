
using Business.Models;

namespace Business.QuizService
{
    public interface IQuizGenerator
    {
        Task<Quiz> GenerateQuiz(string prompt);
    }
}