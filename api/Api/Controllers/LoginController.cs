using Api.Models;
using Business.Models;
using Business.UserService;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{

    [ApiController]
    [Route("/[controller]")]
    public class LoginController : Controller
    {
        private JwtService _jwtService;
        private UserService _userService;

        public LoginController(JwtService jwtService, UserService userService)
        {
            _jwtService = jwtService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginForm model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please provide correct email adress and password");
            }

            var user = new UserDto
            {
                Email = model.Email,
                Password = model.Password
            };

            UserModel? authenticateResult = await _userService.AuthenticateUserAsync(user);
            if (authenticateResult == null)
                return Unauthorized();

            var token = _jwtService.GenerateJwtToken(user.Email, user.Email);
            return Ok(new { Token = token });
        }
    }
}