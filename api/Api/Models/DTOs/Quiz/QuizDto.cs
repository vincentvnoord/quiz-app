
using System.Text.Json.Serialization;

namespace Api.Models.DTOs.Quiz
{
    public class QuizDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("questions")]
        public List<QuestionDto> Questions { get; set; }
    }
}