using Business.Models;

namespace Business.QuizService
{
    public class QuizService
    {
        private readonly IQuizRepository _quizRepository;

        public QuizService(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository;
        }

        public async Task<Quiz> GetQuiz(int id)
        {
            return await _quizRepository.GetQuiz(id);
        }
    }
}