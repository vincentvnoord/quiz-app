using System.Security.Claims;
using Business.GameService;
using Business.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.GameHubManagement
{
    public class GameHub(GameService gameService, IConnectionManager connectionManager) : Hub
    {
        private readonly IConnectionManager _connectionManager = connectionManager;
        private readonly GameService _gameService = gameService;

        [Authorize]
        public async Task ConnectHost(string gameCode)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            if (userId == null)
            {
                return;
            }

            // Order is essential as .AssignHost sends message to the host with current game state (after connection step)
            _connectionManager.Connect(userId, gameCode, Context.ConnectionId);

            await _gameService.AssignHost(gameCode, userId);
        }

        [Authorize]
        public async Task StartGame(string gameCode)
        {
            string? userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                Context.Abort();
                return;
            }

            await _gameService.StartGame(gameCode, userId);
        }

        [Authorize]
        public async Task Continue(string gameCode)
        {
            string? userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                Context.Abort();
                return;
            }

            await _gameService.Continue(gameCode);
        }

        [Authorize]
        public async Task CloseGame(string gameCode)
        {
            string? userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (_gameService.IsHost(gameCode, userId, out Game? game))
            {
                _gameService.CloseGame(game);
                await Clients.Group(gameCode).SendAsync("GameClosed");
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameCode);
            }
        }

        public async Task ConnectPlayer(string gameCode, string playerId)
        {
            PlayerConnectionValidation result = _gameService.ValidatePlayerConnection(gameCode, playerId);
            if (result.Status == PlayerConnectionValidationResult.GameNotFound)
            {
                await Clients.Client(Context.ConnectionId).SendAsync("GameNotFound");
                Context.Abort();
                return;
            }

            if (result.Status == PlayerConnectionValidationResult.NonRegisteredPlayer)
            {
                await Clients.Client(Context.ConnectionId).SendAsync("NonRegisteredPlayer");
                Context.Abort();
                return;
            }

            Player player = result.Player!;
            Game game = result.Game!;

            string connectionId = _connectionManager.AddOrUpdatePlayerConnection(playerId, Context.ConnectionId);
            await Groups.AddToGroupAsync(connectionId, gameCode);
            await Clients.Client(connectionId).SendAsync("Connected", player.Name);

            // Sending message to host that player joined
            //           if (host != null)
            //               await Clients.Client(host).SendAsync("PlayerJoined", new
            //               {
            //                   Id = player.Id,
            //                   Name = player.Name,
            //               });
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
                    // USES WRONG ID: NEEDS TO BE CONNECTION ID
                    await Clients.Client(game.HostId ?? "").SendAsync("PlayerDisconnected", playerId);
                }
            }

            _connectionManager.TryRemoveConnection(connectionId);

            return base.OnDisconnectedAsync(exception);
        }
    }
}