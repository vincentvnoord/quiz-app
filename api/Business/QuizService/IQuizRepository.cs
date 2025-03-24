using Business.Models;

namespace Business.QuizService
{
    public interface IQuizRepository
    {
        public Task<Quiz?> GetQuiz(int id);
        public Task<IEnumerable<Quiz>> GetList();
    }
}