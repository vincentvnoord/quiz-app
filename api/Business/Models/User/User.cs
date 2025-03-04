namespace Business.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public string? Password { get; set; }
    }
}