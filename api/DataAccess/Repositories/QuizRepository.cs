
using Business.Models;
using Business.QuizService;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class QuizRepository : IQuizRepository
    {
        private readonly QuizDbContext _context;

        public QuizRepository(QuizDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateQuiz(int userId, Quiz quiz)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception($"User with ID {userId} not found.");
            }

            Models.Quiz quizEntity = new()
            {
                Title = quiz.Title,
                Questions = [.. quiz.Questions.Select(q => new DataAccess.Models.Question
                {
                    Text = q.Text,
                    Answers = [.. q.Answers.Select(o => new DataAccess.Models.Answer
                    {
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    })]
                })]
            };

            user.Quizzes.Add(quizEntity);
            await _context.SaveChangesAsync();
            return quizEntity.Id;
        }

        public async Task<IEnumerable<Quiz>> GetList(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Quizzes)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new Exception($"User with ID {userId} not found.");
            }
            
            return user.Quizzes;
        }

        public Task<Quiz?> GetQuiz(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateQuiz(Quiz quiz)
        {
            throw new NotImplementedException();
        }
    }
}