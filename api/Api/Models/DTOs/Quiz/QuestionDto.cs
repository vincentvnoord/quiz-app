
using System.Text.Json.Serialization;
using Business.Models;

namespace Api.Models.DTOs.QuizData
{
    public class QuestionDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("text")]
        public string Text { get; set; }
        [JsonPropertyName("answers")]
        public List<AnswerDto> Answers { get; set; }
    }
}