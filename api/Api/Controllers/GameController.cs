using Api.Models;
using Business.GameSessions;
using Business.Models;
using Business.QuizService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Api.GameHubManagement;
using System.Security.Claims;
using System.Net;

namespace Api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameSessionManager _sessionManager;
        private readonly QuizService _quizService;

        public GameController(GameSessionManager gameService, QuizService quizService)
        {
            _sessionManager = gameService;
            _quizService = quizService;
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
            string? gameId = GameSessionManager.GetGameIdByHostId(userId);
            if (gameId != null)
            {
                // Return current game session if it exists and the request does not specify to terminate it
                if (!request.TerminateExisting)
                    return Ok(new { ActiveGameSession = true, Code = gameId });

                // Terminate existing game session because request specifies to do so
                await _sessionManager.CloseGame(gameId, userId);
            }

            // Create a new game session
            int quizId = request.QuizId;
            Quiz? quiz = await _quizService.GetQuiz(quizId);
            if (quiz == null)
            {
                return NotFound("Quiz not found.");
            }

            GameSession newSession = _sessionManager.CreateGameSession(quiz, userId);
            return Ok(new { ActiveGameSession = false, Code = newSession.Game.Id });
        }

        [HttpPost("join")]
        [ProducesResponseType(200, Type = typeof(JoinGameResponse))]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public IActionResult Join([FromBody] JoinGameRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid body.");
            }

            string gameCode = request.Code;

            GameSession? session = GameSessionManager.GetGameSession(gameCode);
            if (session == null)
            {
                return NotFound("Game not found.");
            }
            if (session.Game.State.State != GameStateType.Lobby)
            {
                return BadRequest("Game is not open for joining.");
            }

            var encodedName = WebUtility.HtmlEncode(request.PlayerName);
            var player = new Player(encodedName, request.Code);
            if (session.Game.TryAddPlayer(player))
                return Ok(new JoinGameResponse { PlayerName = player.Name, PlayerId = player.Id });

            return StatusCode(500);
        }
    }
}