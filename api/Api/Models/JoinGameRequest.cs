using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class JoinGameRequest
    {
        [Required]
        [MinLength(6, ErrorMessage = "Code is too short.")]
        [MaxLength(6, ErrorMessage = "Code is too long.")]
        public required string Code { get; set; }

        [Required]
        [MaxLength(50, ErrorMessage = "Player name is too long.")]
        [MinLength(1, ErrorMessage = "Player name is too short.")]
        public required string PlayerName { get; set; }
    }
}