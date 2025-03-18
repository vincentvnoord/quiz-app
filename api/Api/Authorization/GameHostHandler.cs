using System.Security.Claims;
using Api.Authorization;
using Business.GameService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Authorization
{
    public class GameHostHandler : AuthorizationHandler<GameHostRequirement, HubCallerContext>
    {
        private readonly GameService _gameService;
        private readonly ILogger<GameHostHandler> _logger;

        public GameHostHandler(GameService gameService, ILogger<GameHostHandler> logger)
        {
            _gameService = gameService;
            _logger = logger;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, GameHostRequirement requirement, HubCallerContext hubContext)
        {
            _logger.LogInformation("Handling game host requirement.");

            string? userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogInformation("No user ID found in auth request.");
                context.Fail(); // No user ID = Unauthorized
                return Task.CompletedTask;
            }

            var gameCode = hubContext.GetHttpContext()?.Request.Query["gameCode"].ToString();
            if (string.IsNullOrEmpty(gameCode))
            {
                _logger.LogInformation("No game code found in request.");
                context.Fail(); // No game code = Unauthorized
                return Task.CompletedTask;
            }

            var game = _gameService.GetGame(gameCode);
            if (game == null || game.HostId != userId)
            {
                _logger.LogInformation("User tried to access game hub without being the host.");
                context.Fail(); // Not the host = Unauthorized
                return Task.CompletedTask;
            }

            context.Succeed(requirement); // User is the host
            return Task.CompletedTask;
        }
    }
}