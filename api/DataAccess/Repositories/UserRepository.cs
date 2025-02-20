using Business.UserService;
using Business.Models;

namespace DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        public Task CreateUserAsync(User user)
        {
            throw new NotImplementedException();
        }
        
        public Task<User?> GetUserByEmailAsync(string email)
        {
            return null;
        }
    }
}