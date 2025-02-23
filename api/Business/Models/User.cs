namespace Business.Models
{
    public class User
    {
        public int ID { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}