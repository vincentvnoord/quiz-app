using Business.Models;

namespace Business.UserService
{
    public interface IUserRepository
    {
        public Task CreateUserAsync(User user);
        public Task<User?> GetUserByEmailAsync(string email);
    }
}