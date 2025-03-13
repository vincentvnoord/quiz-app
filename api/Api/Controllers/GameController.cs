using System.Threading.Tasks;
using Api.Models;
using Business.GameService;
using Business.Models;
using Business.QuizService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Api.GameHubManagement;
using System.Security.Claims;

namespace Api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class GameController : Controller
    {
        private IHubContext<GameHub> _gameHub;

        private GameService _gameService;
        private QuizService _quizService;

        public GameController(GameService gameService, QuizService quizService, IHubContext<GameHub> gameHub)
        {
            _gameService = gameService;
            _quizService = quizService;
            _gameHub = gameHub;
        }

        [HttpGet]
        public IActionResult GetGame()
        {
            return Ok("Game");
        }

        /// <summary>
        /// NEEDS USER SPECIFIC AUTHORIZATION (CHECK IF USER IS OWNER OF QUIZ)
        /// </summary>
        /// <param name="quizId"></param>
        /// <returns></returns>
        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateGameRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid quiz id.");
            }

            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            // Check if host has an active game session
            string? gameId = _gameService.GetGameIdByHostId(userId);
            if (gameId != null)
            {
                // Return current game session if it exists and the request does not specify to terminate it
                if (!request.TerminateExisting)
                    return Ok(new { ActiveGameSession = true, Code = gameId });

                // Terminate existing game session because request specifies to do so
                _gameService.CloseGame(gameId, userId);
            }

            // Create a new game session
            int quizId = request.QuizId;
            Quiz? quiz = await _quizService.GetQuiz(quizId);
            if (quiz == null)
            {
                return NotFound("Quiz not found.");
            }

            string newGame = _gameService.CreateGame(quiz, userId);
            return Ok(new { ActiveGameSession = false, Code = newGame });
        }

        [HttpPost("join")]
        public IActionResult Join([FromBody] JoinGameRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid body.");
            }

            string gameCode = request.Code;

            Game? game = _gameService.GetGame(gameCode);
            if (game == null)
            {
                return NotFound("Game not found.");
            }

            try
            {
                var player = new Player(request.PlayerName, request.Code);
                game.AddPlayer(player);
                return Ok(new { PlayerId = player.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }
        }
    }
}