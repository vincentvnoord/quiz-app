
using Business.Models;

namespace Api.Models.DTOs.Quiz
{
    public class QuestionDto
    {
        public string Text { get; set; }
        public List<AnswerDto> Answers { get; set; }
    }
}