using System.Security.Claims;
using Business.GameService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.GameHubManagement
{
    public class GameHub(GameService gameService, ConnectionManager connectionManager, ILogger<GameHub> logger) : Hub
    {
        private readonly ILogger<GameHub> _logger = logger;
        private readonly ConnectionManager _connectionManager = connectionManager;
        private readonly GameService _gameService = gameService;

        [Authorize]
        public async Task ConnectHost(string gameCode)
        {
            _logger.LogInformation("Authenticated: ", Context.User?.Identity?.IsAuthenticated);
            var connectionId = Context.ConnectionId;
            Game? game = _gameService.GetGame(gameCode);

            if (game != null)
            {
                game.HostConnectionId = connectionId;
                await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
                Player[] connectedPlayers = [.. game.Players.Where(p => _connectionManager.IsPlayerConnected(p.Id))];
                await Clients.Client(connectionId).SendAsync("HostConnected", new
                {
                    Title = game.Quiz.Title,
                    QuestionCount = game.Quiz.Questions.Length,
                    Players = connectedPlayers.Select(p => new
                    {
                        Id = p.Id,
                        Name = p.Name,
                    }),
                });
            }
            else
            {
                await Clients.Client(connectionId).SendAsync("GameNotFound");
                Context.Abort();
            }
        }

        [Authorize]
        public async Task CloseGame(string gameCode)
        {
            string? userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                await Clients.Caller.SendAsync("Error", "Unauthorized: User ID not found.");
                return;
            }

            // Delay to allow the host to see the game closing
            //            await Task.Delay(2000);
            _gameService.CloseGame(gameCode, userId);
            await Clients.Group(gameCode).SendAsync("GameClosed");
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameCode);
        }

        public async Task ConnectPlayer(string gameCode, string playerId)
        {
            Game? game = _gameService.GetGame(gameCode);
            if (game == null)
            {
                await Clients.Client(Context.ConnectionId).SendAsync("GameNotFound");
                Context.Abort();
                return;
            }

            if (game.TryGetPlayer(playerId, out var player))
            {
                string connectionId = _connectionManager.AddOrUpdatePlayerConnection(playerId, Context.ConnectionId);
                await Groups.AddToGroupAsync(connectionId, gameCode);
                await Clients.Client(connectionId).SendAsync("Connected", player.Name);

                var host = game.HostConnectionId;
                if (host != null)
                    await Clients.Client(host).SendAsync("PlayerJoined", new
                    {
                        Id = player.Id,
                        Name = player.Name,
                    });
            }
            else
            {
                await Clients.Client(Context.ConnectionId).SendAsync("NonRegisteredPlayer");
                Context.Abort();
                return;
            }
        }

        public override async Task<Task> OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;
            string? playerId = _connectionManager.GetPlayerId(connectionId);
            if (playerId != null)
            {
                var game = _gameService.GetGameByPlayerId(playerId);
                if (game != null)
                {
                    await Clients.Client(game.HostConnectionId ?? "").SendAsync("PlayerDisconnected", playerId);
                }
            }

            _connectionManager.TryRemoveConnection(connectionId);

            return base.OnDisconnectedAsync(exception);
        }
    }
}