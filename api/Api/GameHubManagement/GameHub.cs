using System.Security.Claims;
using Business.GameService;
using Business.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.GameHubManagement
{
    public class GameHub(GameService gameService, IConnectionManager connectionManager, IGameMessenger gameMessenger) : Hub
    {
        private readonly IConnectionManager _connectionManager = connectionManager;
        private readonly IGameMessenger _gameMessenger = gameMessenger;

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
            if (userId == null)
            {
                Context.Abort();
                return;
            }

            await _gameService.CloseGame(gameCode, userId);
        }

        public async Task AnswerQuestion(string gameCode, string playerId, int answerIndex)
        {
            string connectionId = Context.ConnectionId;
            string? currentUserId = _connectionManager.GetPlayerId(connectionId);
            if (currentUserId != playerId)
            {
                await _gameMessenger.UnAuthorized(connectionId);
                Context.Abort();
                return;
            }

            await _gameService.AnswerQuestion(gameCode, playerId, answerIndex);
        }

        public async Task ConnectPlayer(string gameCode, string playerId)
        {
            PlayerConnectionValidation result = GameService.ValidatePlayerConnection(gameCode, playerId);
            if (result.Status == PlayerConnectionValidationResult.GameNotFound)
            {
                await _gameMessenger.GameNotFound(Context.ConnectionId);
                Context.Abort();
                return;
            }

            if (result.Status == PlayerConnectionValidationResult.NonRegisteredPlayer)
            {
                await _gameMessenger.NonRegisteredPlayer(Context.ConnectionId);
                Context.Abort();
                return;
            }

            // Valid so make connection
            string connectionId = Context.ConnectionId;
            _connectionManager.Connect(playerId, gameCode, connectionId);

            // Send over to game service which notifies necessary players
            Player player = result.Player!;
            Game game = result.Game!;
            await _gameService.OnPlayerConnected(player, game);
        }

        public override async Task<Task> OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;
            string? playerId = _connectionManager.GetPlayerId(connectionId);
            if (playerId != null)
            {
                var game = GameService.GetGameByPlayerId(playerId);
                if (game != null)
                {
                    await _gameMessenger.NotifyHostPlayerDisconnected(game.HostId, playerId);
                }
            }

            _connectionManager.TryRemoveConnection(connectionId);

            return base.OnDisconnectedAsync(exception);
        }
    }
}