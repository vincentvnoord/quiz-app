
using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class GenerateQuizRequest
    {
        [Required]
        public string Prompt { get; set; }
    }
}