using Business.Models;

namespace Business.UserService
{
    public interface IUserRepository
    {
        public Task CreateUserAsync(UserModel user);
        public Task<UserModel?> GetUserByEmailAsync(string email);
        public Task<UserModel?> GetUserByIdAsync(int userId);
    }
}