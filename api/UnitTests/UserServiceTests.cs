using Business.Models;
using Business.UserService;
using Moq;

namespace UnitTests;

public class UserServiceTests
{
    [SetUp]
    public void Setup()
    {
    }


    /// <summary>
    /// When a user is created, the password should be hashed before entering the repository method.
    /// </summary>
    /// <returns></returns>
    [Test]
    public async Task RegisterPassword_SavesHashed()
    {
        var mockRepository = new Mock<IUserRepository>();
        var passwordHasher = new PasswordHasher();
        var userService = new UserService(mockRepository.Object, passwordHasher);

        var userDto = new UserDto { Email = "test@example.com", Password = "plainTextPass" };

        // Remove checking if user exists
        mockRepository.Setup(repo => repo.GetUserByEmailAsync(userDto.Email))
                      .ReturnsAsync((UserModel?)null);

        // Capture the hashed password that is passed to the repository
        string? capturedHashedPassword = null;
        mockRepository.Setup(repo => repo.CreateUserAsync(It.IsAny<UserModel>()))
                      .Callback<UserModel>(user => capturedHashedPassword = user.Password)
                      .Returns(Task.CompletedTask);

        await userService.CreateUserAsync(userDto);

        Assert.That(capturedHashedPassword, Is.Not.Null);
        Assert.That(capturedHashedPassword, Is.Not.EqualTo(userDto.Password));
    }

    [TestCase("password", "$2a$11$", false)]
    [TestCase("password", "password", true)]
    [TestCase("test", "", false)]
    public void VerifyPasswordTest(string inputPassword, string savedPassword, bool expected)
    {
        var passwordHasher = new PasswordHasher();
        string correctHashedPassword = passwordHasher.HashPassword(savedPassword);
        
        Assert.That(passwordHasher.VerifyPassword(correctHashedPassword, inputPassword), Is.EqualTo(expected));
    }
}