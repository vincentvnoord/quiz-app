using Business.Models;
using Business.QuizService;

namespace DataAccess.Mocks
{
    public class QuizRepositoryMock : IQuizRepository
    {
        public Task<Quiz> GetQuiz(int id)
        {
            var answers = new Answer(0, "Answer 1", true);
            Question[] questions = [
                new Question(0, "Question 1"),
                new Question(1, "Question 2"),
            ];

            return Task.FromResult(new Quiz(0, "Quiz Title (from mock)", questions));
        }
    }
}