
using Business.Models;

namespace Business.QuizService
{
    public class MockQuizGenerator : IQuizGenerator
    {
        public Task<Quiz> GenerateQuiz(string prompt)
        {
            var question = new Question(1, "Sample Question", new Answer[]
            {
                new Answer(1, "Answer 1", true),
                new Answer(2, "Answer 2", false),
                new Answer(3, "Answer 3", false),
                new Answer(4, "Answer 4", false)
            });

            var quiz = new Quiz
            {
                Title = "Generated Quiz",
                Questions = [question]
            };

            return Task.FromResult(quiz);
        }
    }
}