using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public required string Email { get; set; }
        public required string Password { get; set; }

        public ICollection<Quiz> Quizzes { get; set; } = [];
    }
}
