
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Api.Hubs.DashboardHub;
using Api.Models;
using Api.Models.DTOs.QuizData;
using Business.Models;
using Business.QuizService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IHubContext<DashboardHub> _hubContext;
        private readonly QuizService _quizService;
        private string _openaiApiKey;

        public QuizController(QuizService quizService, IConfiguration configuration, IHubContext<DashboardHub> hubContext)
        {
            _hubContext = hubContext;
            _quizService = quizService;
            _openaiApiKey = configuration["OpenAI:ApiKey"] ?? throw new ArgumentNullException("OpenAI API key is not set in the configuration.");
        }

        [HttpGet("list")]
        public async Task<IActionResult> List()
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            if (!int.TryParse(userId, out var parsedId))
            {
                return BadRequest();
            }

            var list = await _quizService.GetList(parsedId);
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

                List<QuestionDto> questions = quiz.Questions.Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Answers = q.Answers.Select(a => new AnswerDto
                    {
                        Id = a.Id,
                        Text = a.Text,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList();

                return Ok(new { questions });
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

        [HttpPost("test")]
        public IActionResult Test()
        {
            try
            {
                string argumentsJson = @"
                {
                    ""title"": ""Sample Quiz"",
                    ""questions"": [
                        {
                            ""text"": ""What is the capital of France?"",
                            ""answers"": [
                                { ""text"": ""Paris"", ""isCorrect"": true },
                                { ""text"": ""London"", ""isCorrect"": false },
                                { ""text"": ""Berlin"", ""isCorrect"": false },
                                { ""text"": ""Madrid"", ""isCorrect"": false }
                            ]
                        }
                    ]
                } 
                ";
                var quiz = JsonSerializer.Deserialize<QuizDto>(argumentsJson);
                Console.WriteLine(quiz);
                return Ok(quiz);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Failed to parse quiz structure.");
            }
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] GenerateQuizRequest request)
        {
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            if (!int.TryParse(userId, out int parsedUserId))
            {
                return BadRequest("Invalid user ID.");
            }

            if (string.IsNullOrEmpty(request.Prompt))
            {
                return BadRequest("Prompt is required.");
            }

            // Check if user has enough credits.

            // Create a new quiz for the user, get the ID back.
            var quizId = await _quizService.CreateQuiz(parsedUserId, new Quiz
            {
                Title = "New Quiz",
                Questions = []
            });

            _ = Task.Run(async () =>
            {
                try
                {

                    // Wait for the quiz to be generated.
                    var generatedQuiz = await _quizService.GenerateQuiz(request.Prompt);

                    if (generatedQuiz == null)
                    {
                        // Handle quiz generation failure
                        return;
                    }

                    await Task.Delay(1000);

                    // Update the quiz record in the database.
                    var updateResult = await _quizService.UpdateQuiz(generatedQuiz);

                    QuizDto quizDto = new QuizDto(generatedQuiz);
                    // Tell hub context to update the quiz in the client.
                    await _hubContext.Clients.Client(userId).SendAsync("UpdateQuiz", new { quizDto });
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    // Handle any exceptions that occur during quiz generation
                }
            });

            return Ok(new { quizId });

            var _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _openaiApiKey);

            var requestBody = new
            {
                model = "gpt-4.1-mini",
                messages = new[]
                {
                new { role = "user", content = request.Prompt },
                new { role = "system", content = "Create a quiz for this user" },
                new { role = "system", content = "Each quiz has a title with max character length of 64 and each question has answers inside, which should always be 4 answers. Also each answer needs to have an isCorrect property which defines if its correct or not." }
            },
                tools = new[]
                {
                new
                {
                    type = "function",
                    function = new
                    {
                        name = "quiz_generator",
                        description = "Generates a structured quiz object",
                        parameters = new
                        {
                            type = "object",
                            properties = new
                            {
                                title = new {
                                    type = "string",
                                    description = "The title of the quiz",
                                },
                                questions = new
                                {
                                    type = "array",
                                    items = new
                                    {
                                        type = "object",
                                        properties = new
                                        {
                                            text = new
                                            {
                                                type = "string",
                                                description = "The question text",
                                            },
                                            answers = new {
                                                type = "array",
                                                items = new {
                                                    type = "object",
                                                    properties = new {
                                                        text = new {
                                                            type = "string",
                                                            description = "The answer text",
                                                        },
                                                        isCorrect = new {
                                                            type = "boolean",
                                                            description = "Indicates if the answer is correct",
                                                        }
                                                    },
                                                    required = new[] { "text", "isCorrect" },
                                                    additionalProperties = false
                                                }
                                            }
                                        },
                                        required = new[] { "text", "answers" },
                                        additionalProperties = false,
                                    }
                                }
                            },
                            required = new[] { "questions", "title" },
                            additionalProperties = false
                        }
                    }
                }
            },
                tool_choice = new { type = "function", function = new { name = "quiz_generator" } }
            };

            var response = await _httpClient.PostAsync(
                "https://api.openai.com/v1/chat/completions",
                new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, error);
            }

            var jsonString = await response.Content.ReadAsStringAsync();

            Console.WriteLine(jsonString);

            var obj = System.Text.Json.JsonSerializer.Deserialize<JsonNode>(jsonString);
            var argumentsJson = obj["choices"]?[0]?["message"]?["tool_calls"]?[0]?["function"]?["arguments"]?.ToString();

            if (argumentsJson == null)
            {
                return BadRequest("Failed to parse quiz structure.");
            }

            Console.WriteLine("ArgumentsJson:" + argumentsJson);
            try
            {
                var quiz = JsonSerializer.Deserialize<QuizDto>(argumentsJson);
                Console.WriteLine(quiz);
                return Ok(quiz);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Failed to parse quiz structure.");
            }
        }
    }
}