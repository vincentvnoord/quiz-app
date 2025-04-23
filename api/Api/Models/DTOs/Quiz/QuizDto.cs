
namespace Api.Models.DTOs.Quiz
{
    public class QuizDto
    {
        public string Title { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }
}