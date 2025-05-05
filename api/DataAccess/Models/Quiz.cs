
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public class Quiz
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        public ICollection<Question> Questions { get; set; } = [];

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}