using Business.Models;

namespace Business.UserService
{
    public class UserService(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;

        public async Task CreateUserAsync(UserDto userDto)
        {
            UserModel? existingUser = await _userRepository.GetUserByEmailAsync(userDto.Email);
            if (existingUser != null)
            {
                throw new RegistrationException("Email already exists", RegistrationExceptionType.EmailAlreadyExists);
            }

            string hashedPassword = _passwordHasher.HashPassword(userDto.Password);

            var user = new UserModel
            {
                Email = userDto.Email,
                Password = hashedPassword,
            };

            await _userRepository.CreateUserAsync(user);
        }

        public async Task<UserModel?> AuthenticateUserAsync(UserDto userDto)
        {
            UserModel? user = await _userRepository.GetUserByEmailAsync(userDto.Email);
            if (user == null)
            {
                return null;
            }

            if (user.Password == null)
            {
                throw new ArgumentNullException("Password cannot be null");
            }

            bool correctPassword = _passwordHasher.VerifyPassword(user.Password, userDto.Password);
            if (!correctPassword)
            {
                return null;
            }

            return user;
        }

        public async Task<UserModel?> GetUserByIdAsync(int userId)
        {
            return await _userRepository.GetUserByIdAsync(userId);
        }
    }
}