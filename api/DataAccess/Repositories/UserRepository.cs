using Business.UserService;
using Business.Models;
using Microsoft.EntityFrameworkCore;
using DataAccess.Models;

namespace DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly QuizDbContext _context;

        public UserRepository(QuizDbContext context)
        {
            _context = context;
        }

        public async Task CreateUserAsync(UserModel user)
        {
            if (user.Password == null)
            {
                throw new ArgumentNullException("Password cannot be null");
            }

            var newUser = new User
            {
                Email = user.Email,
                Password = user.Password
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();
        }

        public async Task<UserModel?> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return null;
            }

            return new UserModel
            {
                Id = user.Id,
                Email = user.Email,
                Password = user.Password
            };
        }

        public async Task<UserModel?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return null;
            }

            return new UserModel
            {
                Id = user.Id,
                Email = user.Email,
                Password = user.Password
            };
        }
    }
}