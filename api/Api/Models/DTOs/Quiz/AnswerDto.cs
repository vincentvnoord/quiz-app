
using System.Text.Json.Serialization;
using Business.Models;

namespace Api.Models.DTOs.Quiz
{
    public class AnswerDto
    {
        [JsonPropertyName("text")]
        public string Text { get; set; }

        [JsonPropertyName("isCorrect")]
        public bool IsCorrect { get; set; }
    }
}