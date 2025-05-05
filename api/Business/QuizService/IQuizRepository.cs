using Business.Models;

namespace Business.QuizService
{
    public interface IQuizRepository
    {
        public Task<Quiz?> GetQuiz(int id);
        public Task<IEnumerable<Quiz>> GetList(int userId);
        public Task<int> CreateQuiz(int userId, Quiz quiz);
        public Task<bool> UpdateQuiz(Quiz quiz);
    }
}