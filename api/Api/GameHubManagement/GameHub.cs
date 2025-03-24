using System.Security.Claims;
using Business.GameSessions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.GameHubManagement
{
    public class GameHub(GameSessionManager sessionManager, IConnectionManager connectionManager, IGameMessenger gameMessenger) : Hub
    {
        private readonly IConnectionManager _connectionManager = connectionManager;
        private readonly IGameMessenger _gameMessenger = gameMessenger;

        private readonly GameSessionManager _sessionManager = sessionManager;

        [Authorize]
        public async Task ConnectHost(string gameCode)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            if (userId == null)
            {
                return;
            }

            _connectionManager.Connect(userId, gameCode, Context.ConnectionId);
            GameSession? session = GameSessionManager.GetGameSession(gameCode);

            if (session != null)
            {
                await _gameMessenger.HostConnected(userId, session);
            }
            else
            {
                await _gameMessenger.GameNotFound(userId);
            }
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

            GameSession? session = GameSessionManager.GetGameSession(gameCode);
            if (session == null)
            {
                await _gameMessenger.GameNotFound(Context.ConnectionId);
                Context.Abort();
                return;
            }

            await session.Start();
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

            GameSession? session = GameSessionManager.GetGameSession(gameCode);
            if (session == null)
            {
                await _gameMessenger.GameNotFound(Context.ConnectionId);
                Context.Abort();
                return;
            }

            await session.Continue();
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

            await _sessionManager.CloseGame(gameCode, userId);
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

            GameSession? session = GameSessionManager.GetGameSession(gameCode);
            if (session == null)
            {
                await _gameMessenger.GameNotFound(connectionId);
                Context.Abort();
                return;
            }

            await session.AnswerQuestion(playerId, answerIndex);
        }

        public async Task ConnectPlayer(string gameCode, string playerId)
        {
            PlayerConnectionValidation result = GameSessionManager.ValidatePlayerConnection(gameCode, playerId);
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

            // Notify the game session
            Player player = result.Player!;
            GameSession session = result.Session!;
            await session.OnPlayerJoined(player);
        }

        public override async Task<Task> OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;
            string? playerId = _connectionManager.GetPlayerId(connectionId);
            if (playerId != null)
            {
                var session = GameSessionManager.GetGameSessionByPlayerId(playerId);
                if (session != null)
                {
                    _connectionManager.TryRemoveConnection(connectionId);
                    await _gameMessenger.NotifyHostPlayerDisconnected(session.Game.HostId, playerId);
                }
            }

            return base.OnDisconnectedAsync(exception);
        }
    }
}