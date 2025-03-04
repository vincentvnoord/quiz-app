
using Business.Models;
using Business.UserService;

namespace DataAccess.Mocks
{
    public class UserRepositoryMock : IUserRepository
    {
        private static Dictionary<string, UserModel> _users = new Dictionary<string, UserModel>();

        public UserRepositoryMock()
        {
            Console.WriteLine("--------------------------");
            Console.WriteLine("USING MOCK USER REPOSITORY");
            Console.WriteLine("--------------------------");
        }

        public Task CreateUserAsync(UserModel user)
        {
            Console.WriteLine("Adding user to mock repository:" + user.Email);
            Console.WriteLine("Email: " + user.Email);
            Console.WriteLine("Password (Hashed): " + user.Password);

            _users[user.Email] = user;
            return Task.CompletedTask;
        }

        public Task<UserModel?> GetUserByEmailAsync(string email)
        {
            if (_users.ContainsKey(email))
            {
                UserModel user = _users[email];
                return Task.FromResult<UserModel?>(user);
            }
            else
            {
                return Task.FromResult<UserModel?>(null);
            }
        }

        public Task<UserModel?> GetUserByIdAsync(int userId)
        {
            return Task.FromResult<UserModel?>(_users.Values.FirstOrDefault(u => u.Id == userId));
        }
    }
}