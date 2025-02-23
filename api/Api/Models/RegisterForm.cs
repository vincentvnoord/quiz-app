using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class RegisterForm
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(12, ErrorMessage = "Password must be at least 12 characters long")]
        public required string Password { get; set; }
    }
}