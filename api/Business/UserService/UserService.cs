using Business.Models;

namespace Business.UserService
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;

        public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }

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
    }
}