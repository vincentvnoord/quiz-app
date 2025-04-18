
using Business.QuizService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly QuizService _quizService;

        public QuizController(QuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpGet("list")]
        public async Task<IActionResult> List()
        {
            var list = await _quizService.GetList();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                int parsedId = int.Parse(id);
                var quiz = await _quizService.GetQuiz(parsedId);
                if (quiz == null)
                {
                    return NotFound();
                }

                return Ok(quiz);
            }
            catch (FormatException ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest($"Invalid quiz ID format: {id}.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, $"Internal server error");
            }
        }
    }
}