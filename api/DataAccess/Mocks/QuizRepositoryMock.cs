using Business.Models;
using Business.QuizService;

namespace DataAccess.Mocks
{
    public class QuizRepositoryMock : IQuizRepository
    {
        public Task<Quiz> GetQuiz(int id)
        {
            var questions = CreateProgrammingQuestions();

            return Task.FromResult(new Quiz(0, "General Programming Knowledge", questions));
        }

        public static Question[] CreateProgrammingQuestions()
        {
            return
            [
        new Question(
            id: 1,
            text: "What does 'HTML' stand for?",
            answers: new Answer[]
            {
                new Answer(1, "HyperText Markup Language", true),
                new Answer(2, "High-Level Text Machine Language", false),
                new Answer(3, "Home Tool Markup Language", false),
                new Answer(4, "Hyperlink and Text Management Language", false)
            },
            30
        ),
        new Question(
            id: 2,
            text: "Which programming language is known for its use in data science and machine learning?",
            answers: new Answer[]
            {
                new Answer(1, "Java", false),
                new Answer(2, "Python", true),
                new Answer(3, "C++", false),
                new Answer(4, "Ruby", false)
            },
            10
        ),
        new Question(
            id: 3,
            text: "What is the output of '2 + 2 * 2' in most programming languages?",
            answers: new Answer[]
            {
                new Answer(1, "6", true),
                new Answer(2, "8", false),
                new Answer(3, "4", false),
                new Answer(4, "Syntax Error", false)
            }
        ),
        new Question(
            id: 4,
            text: "Which of the following is NOT a JavaScript framework?",
            answers: new Answer[]
            {
                new Answer(1, "React", false),
                new Answer(2, "Angular", false),
                new Answer(3, "Django", true),
                new Answer(4, "Vue.js", false)
            }
        ),
        new Question(
            id: 5,
            text: "What does 'API' stand for?",
            answers: new Answer[]
            {
                new Answer(1, "Application Programming Interface", true),
                new Answer(2, "Advanced Programming Interface", false),
                new Answer(3, "Automated Programming Interface", false),
                new Answer(4, "Application Process Integration", false)
            }
        )
            ];
        }
    }
}