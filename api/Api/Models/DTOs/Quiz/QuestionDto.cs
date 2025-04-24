
using System.Text.Json.Serialization;
using Business.Models;

namespace Api.Models.DTOs.Quiz
{
    public class QuestionDto
    {
        [JsonPropertyName("text")]
        public string Text { get; set; }
        [JsonPropertyName("answers")]
        public List<AnswerDto> Answers { get; set; }
    }
}