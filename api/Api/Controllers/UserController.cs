using System.Security.Claims;
using Business.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    [Authorize]
    public class UserController : Controller
    {
        private ILogger<UserController> _logger;
        private UserService _userService;

        public UserController(UserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult> Index()
        {
            _logger.LogInformation("Fetching user data");
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null)
                {
                    _logger.LogWarning("User id not found in JWT");
                    return Unauthorized("Invalid token");
                }

                int parsedId = int.Parse(userId);

                var user = await _userService.GetUserByIdAsync(parsedId);
                if (user == null)
                {
                    _logger.LogWarning("User not found");
                    return NotFound("User not found");
                }

                return Ok(new
                {
                    id = user.Id,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user data");
                return BadRequest("Something went wrong fetching user data");
            }
        }
    }
}