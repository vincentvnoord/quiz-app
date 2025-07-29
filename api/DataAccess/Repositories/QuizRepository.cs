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

            return user.Quizzes.Select(q => new Quiz(
                q.Id,
                q.Title,
                q.Questions.Select(question => new Business.Models.Question(
                    question.Id,
                    question.Text,
                    question.Answers.Select(a => new Business.Models.Answer(a.Id, a.Text, a.IsCorrect)).ToArray()
                )).ToArray()
            ));
        }

        public async Task<Quiz?> GetQuiz(int id)
        {
            var quiz = await _context.Quizzes
                .Include(quiz => quiz.Questions)
                .ThenInclude(question => question.Answers)
                .FirstOrDefaultAsync(quiz => quiz.Id == id);

            if (quiz == null)
            {
                throw new Exception($"Quiz with ID {id} not found.");
            }

            return new Quiz(
                quiz.Id,
                quiz.Title,
                quiz.Questions.Select(question => new Business.Models.Question(
                    question.Id,
                    question.Text,
                    question.Answers.Select(a => new Business.Models.Answer(a.Id, a.Text, a.IsCorrect)).ToArray()
                )).ToArray()
            );
        }

        public async Task<bool> UpdateQuiz(Quiz quiz)
        {
            var existingQuiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(question => question.Answers)
                .FirstOrDefaultAsync(q => q.Id == quiz.Id);

            if (existingQuiz == null)
            {
                throw new Exception($"Quiz with ID {quiz.Id} not found.");
            }

            // Update title
            existingQuiz.Title = quiz.Title;

            // Remove all existing questions and answers
            _context.RemoveRange(existingQuiz.Questions.SelectMany(q => q.Answers));
            _context.RemoveRange(existingQuiz.Questions);

            // Add all new questions and answers
            existingQuiz.Questions = quiz.Questions.Select(q => new DataAccess.Models.Question
            {
                Text = q.Text,
                Answers = q.Answers.Select(a => new DataAccess.Models.Answer
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            await _context.SaveChangesAsync();
            return true;
        }
    }
}