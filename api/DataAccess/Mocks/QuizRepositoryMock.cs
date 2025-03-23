using Business.Models;
using Business.QuizService;

namespace DataAccess.Mocks
{
    public class QuizRepositoryMock : IQuizRepository
    {
        public Task<Quiz> GetQuiz(int id)
        {
            var questions = GetGeneralKnowledgeQuestions();

            return Task.FromResult(new Quiz(0, "General Programming Knowledge", questions));
        }

        public static Question[] GetGeneralKnowledgeQuestions()
        {
            return new Question[]
            {
        new Question(1, "What is the capital of France?",
            new Answer[]
            {
                new Answer(0, "Paris", true),
                new Answer(1, "London", false),
                new Answer(2, "Berlin", false),
                new Answer(3, "Madrid", false),
            }, 30),

        new Question(2, "Which planet is known as the Red Planet?",
            new Answer[]
            {
                new Answer(0, "Mars", true),
                new Answer(1, "Venus", false),
                new Answer(2, "Earth", false),
                new Answer(3, "Jupiter", false),
            }, 30),

        new Question(3, "Who wrote the play 'Romeo and Juliet'?",
            new Answer[]
            {
                new Answer(0, "William Shakespeare", true),
                new Answer(1, "Charles Dickens", false),
                new Answer(2, "George Orwell", false),
                new Answer(3, "Mark Twain", false),
            }, 30),

        new Question(4, "What is the largest mammal in the world?",
            new Answer[]
            {
                new Answer(0, "Blue Whale", true),
                new Answer(1, "Elephant", false),
                new Answer(2, "Giraffe", false),
                new Answer(3, "Shark", false),
            }, 30),

        new Question(5, "Which element has the chemical symbol 'O'?",
            new Answer[]
            {
                new Answer(0, "Oxygen", true),
                new Answer(1, "Osmium", false),
                new Answer(2, "Ozone", false),
                new Answer(3, "Opium", false),
            }, 30),

        new Question(6, "In which year did the Titanic sink?",
            new Answer[]
            {
                new Answer(0, "1912", true),
                new Answer(1, "1905", false),
                new Answer(2, "1923", false),
                new Answer(3, "1898", false),
            }, 30),

        new Question(7, "Who was the first president of the United States?",
            new Answer[]
            {
                new Answer(0, "George Washington", true),
                new Answer(1, "Abraham Lincoln", false),
                new Answer(2, "Thomas Jefferson", false),
                new Answer(3, "John Adams", false),
            }, 30),

        new Question(8, "What is the longest river in the world?",
            new Answer[]
            {
                new Answer(0, "Amazon River", true),
                new Answer(1, "Nile River", false),
                new Answer(2, "Yangtze River", false),
                new Answer(3, "Mississippi River", false),
            }, 30),

        new Question(9, "Who discovered gravity?",
            new Answer[]
            {
                new Answer(0, "Isaac Newton", true),
                new Answer(1, "Albert Einstein", false),
                new Answer(2, "Galileo Galilei", false),
                new Answer(3, "Nikola Tesla", false),
            }, 30),

        new Question(10, "Which country is known as the Land of the Rising Sun?",
            new Answer[]
            {
                new Answer(0, "Japan", true),
                new Answer(1, "China", false),
                new Answer(2, "South Korea", false),
                new Answer(3, "Vietnam", false),
            }, 30)
            };
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
            15
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
            15
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