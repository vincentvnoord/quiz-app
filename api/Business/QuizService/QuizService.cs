using Business.Models;

namespace Business.QuizService
{
    public class QuizService
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IQuizGenerator _quizGenerator;

        public QuizService(IQuizRepository quizRepository, IQuizGenerator quizGenerator)
        {
            _quizRepository = quizRepository;
            _quizGenerator = quizGenerator;
        }

        public async Task<Quiz?> GetQuiz(int id)
        {
            return await _quizRepository.GetQuiz(id);
        }

        public async Task<IEnumerable<Quiz>> GetList(int userId)
        {
            return await _quizRepository.GetList(userId);
        }

        public async Task<bool> UpdateQuiz(Quiz quiz)
        {
            var existingQuiz = await _quizRepository.GetQuiz(quiz.Id);
            if (existingQuiz == null)
            {
                throw new Exception($"Quiz with ID {quiz.Id} not found.");
            }

            return await _quizRepository.UpdateQuiz(quiz);
        }

        public async Task<int> CreateQuiz(int userId, Quiz quiz)
        {
            return await _quizRepository.CreateQuiz(userId, quiz);
        }

        public async Task<Quiz> GenerateQuiz(string prompt)
        {
            var quiz = await _quizGenerator.GenerateQuiz(prompt);
            return quiz;
        }
    }
}