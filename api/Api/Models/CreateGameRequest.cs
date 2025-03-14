using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class CreateGameRequest
    {
        public bool TerminateExisting { get; set; }

        [Required]
        public required int QuizId { get; set; }
    }
}