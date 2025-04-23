
using Business.Models;

namespace Api.Models.DTOs.Quiz
{
    public class AnswerDto
    {
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}