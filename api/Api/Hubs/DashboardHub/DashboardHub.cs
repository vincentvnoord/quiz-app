using System.Security.Claims;
using Api.Models.DTOs.QuizData;
using Business.Models;
using Business.QuizService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs.DashboardHub
{
    [Authorize]
    public class DashboardHub : Hub
    {
        private readonly QuizService _quizService;

        public DashboardHub(QuizService quizService)
        {
            _quizService = quizService;
        }

        public async Task GenerateQuiz(string prompt)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                Context.Abort();
                return;
            }

            // Parse user ID from string to int.
            if (!int.TryParse(userId, out int parsedUserId))
            {
                await Clients.Caller.SendAsync("QuizGenerationFailed", "Invalid user ID.");
                return;
            }

            // Check if user has enough credits.

            // Create a new quiz for the user, get the ID back.
            var quizId = await _quizService.CreateQuiz(parsedUserId, new Quiz
            {
                Title = "New Quiz",
                Questions = []
            });

            // Wait for the quiz to be generated.
            var generatedQuiz = await _quizService.GenerateQuiz(prompt);
            if (generatedQuiz == null)
            {
                await Clients.Caller.SendAsync("QuizGenerationFailed", "Failed to generate quiz.");
                return;
            }

            // Update the quiz record in the database.
            var updateResult = await _quizService.UpdateQuiz(new Quiz
            {
                Id = quizId,
                Title = generatedQuiz.Title,
                Questions = generatedQuiz.Questions
            });

            if (!updateResult)
            {
                await Clients.Caller.SendAsync("QuizGenerationFailed", "Failed to save generated quiz.");
                return;
            }

            // Send the quiz back to the user.
            await Clients.Caller.SendAsync("GeneratedQuiz", new QuizDto(generatedQuiz));
        }
    }
}
