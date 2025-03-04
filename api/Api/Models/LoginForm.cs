using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class LoginForm
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Please submit a password")]
        public required string Password { get; set; }
    }
}