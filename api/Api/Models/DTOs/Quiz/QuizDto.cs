
using System.Text.Json.Serialization;
using Business.Models;

namespace Api.Models.DTOs.QuizData
{
    public class QuizDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("questions")]
        public List<QuestionDto> Questions { get; set; }
    
        public QuizDto(Quiz quiz)
        {
            Title = quiz.Title;
            Questions = new List<QuestionDto>();
            foreach (var question in quiz.Questions)
            {
                var answers = new List<AnswerDto>();
                foreach (var answer in question.Answers)
                {
                    answers.Add(new AnswerDto
                    {
                        Text = answer.Text,
                        IsCorrect = answer.IsCorrect
                    });
                }
                Questions.Add(new QuestionDto
                {
                    Text = question.Text,
                    Answers = answers
                });
            }
        }
    }
}