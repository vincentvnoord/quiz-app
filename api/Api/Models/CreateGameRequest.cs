using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class CreateGameRequest
    {
        [Required]
        public required int QuizId { get; set; }
    }
}