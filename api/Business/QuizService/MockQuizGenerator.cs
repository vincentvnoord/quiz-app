
using Business.Models;

namespace Business.QuizService
{
    public class MockQuizGenerator : IQuizGenerator
    {
        public Task<Quiz> GenerateQuiz(string prompt)
        {
            var quiz = new Quiz
            {
                Title = "Generated Quiz",
                Questions = []
            };

            return Task.FromResult(quiz);
        }
    }
}