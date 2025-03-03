using Business.Models;

namespace Business.UserService
{
    public class UserService(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IPasswordHasher _passwordHasher = passwordHasher;

        public async Task CreateUserAsync(UserDto userDto)
        {
            User? existingUser = await _userRepository.GetUserByEmailAsync(userDto.Email);
            if (existingUser != null)
            {
                throw new RegistrationException("Email already exists", RegistrationExceptionType.EmailAlreadyExists);
            }

            string hashedPassword = _passwordHasher.HashPassword(userDto.Password);

            var user = new User
            {
                Email = userDto.Email,
                Password = hashedPassword,
            };

            await _userRepository.CreateUserAsync(user);
        }

        public async Task<bool> AuthenticateUserAsync(UserDto userDto)
        {
            User? user = await _userRepository.GetUserByEmailAsync(userDto.Email);
            if (user == null)
            {
                return false;
            }

            return _passwordHasher.VerifyHashedPassword(user.Password, userDto.Password);
        }
    }
}