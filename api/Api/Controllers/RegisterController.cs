
using api.Models;
using Business.Models;
using Business.UserService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class RegisterController : Controller
    {
        private UserService _userService;

        public RegisterController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Index([FromBody] RegisterForm form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _userService.CreateUserAsync(new UserDto
                {
                    Email = form.Email,
                    Password = form.Password
                });
            }
            catch (RegistrationException e)
            {
                if (e.Type == RegistrationExceptionType.EmailAlreadyExists)
                {
                    return Conflict("Email already exists.");
                }
                else
                {
                    Console.Error.WriteLine(e);
                    return StatusCode(500, "Something went wrong while creating the user.");
                }
            }
            catch (Exception e)
            {
                Console.Error.WriteLine(e);
                return StatusCode(500, "Something went wrong while creating the user.");
            }

            return Ok();
        }
    }
}