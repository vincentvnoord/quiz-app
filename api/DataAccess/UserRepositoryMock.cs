
using Business.Models;
using Business.UserService;

namespace DataAccess
{
    public class UserRepositoryMock : IUserRepository
    {
        private static Dictionary<string, User> _users = new Dictionary<string, User>();
        
        public UserRepositoryMock()
        {
            Console.WriteLine("--------------------------");
            Console.WriteLine("USING MOCK USER REPOSITORY");
            Console.WriteLine("--------------------------");
        }

        public Task CreateUserAsync(User user)
        {
            Console.WriteLine("Adding user to mock repository:" + user.Email);
            Console.WriteLine("Email: " + user.Email);
            Console.WriteLine("Password (Hashed): " + user.Password);

            _users[user.Email] = user;
            return Task.CompletedTask;
        }

        public Task<User?> GetUserByEmailAsync(string email)
        {
            if (_users.ContainsKey(email))
            {
                User user = _users[email];
                return Task.FromResult<User?>(user);
            }
            else
            {
                return Task.FromResult<User?>(null);
            }
        }
    }
}