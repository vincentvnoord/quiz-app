using Api.Models;
using Business.GameService;
using Business.Models;
using Business.QuizService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class GameController : Controller
    {
        private GameService _gameService;
        private QuizService _quizService;

        public GameController(GameService gameService, QuizService quizService)
        {
            _gameService = gameService;
            _quizService = quizService;
        }

        [HttpGet]
        public IActionResult GetGame()
        {
            return Ok("Game");
        }


        /// <summary>
        /// NEEDS USER SPECIFIC AUTHORIZATION (CHECK IF USER IS OWNER OF QUIZ)
        /// also check if user already created a game, so they can't overflow the server with games 
        /// </summary>
        /// <param name="quizId"></param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateGameRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid quiz id.");
            }
            
            int quizId = request.QuizId;

            Quiz? quiz = await _quizService.GetQuiz(quizId);
            if (quiz == null)
            {
                return NotFound("Quiz not found.");
            }

            string gameId = _gameService.CreateGame(quiz);
            return Ok(new { Code = gameId });
        }
    }
}