
using System.Text.Json.Serialization;
using Business.Models;

namespace Api.Models.DTOs.QuizData
{
    public class AnswerDto
    {
        [JsonPropertyName("text")]
        public string Text { get; set; }

        [JsonPropertyName("isCorrect")]
        public bool IsCorrect { get; set; }
    }
}