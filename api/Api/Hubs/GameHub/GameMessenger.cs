using Api.Models.DTOs.GameState;
using Business.GameSessions;
using Business.Models;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs.GameHub
{
    public class GameMessenger : IGameMessenger
    {
        private readonly IHubContext<GameHub> _gameHub;
        private readonly IConnectionManager _connectionManager;

        public GameMessenger(IHubContext<GameHub> gameHub, IConnectionManager connectionManager)
        {
            _gameHub = gameHub;
            _connectionManager = connectionManager;
        }

        public async Task GameNotFound(string userId)
        {
            await _gameHub.Clients.Client(userId).SendAsync("GameNotFound");
        }

        public async Task HostConnected(string hostId, GameSession session)
        {
            string? hostConnectionId = _connectionManager.GetConnectionId(hostId);
            if (hostConnectionId == null)
                return;

            // Only show the connected players to the host, not all players that are registered
            Player[] players = _connectionManager.getConnectedPlayers(session.Game);
            var gameState = new HostGameStateDto(session, [.. players.Select(p => new PlayerDto(p))]);
            await _gameHub.Clients.Client(hostConnectionId).SendAsync("HostConnected", gameState);
        }

        public async Task GameStarted(string gameCode, int timer)
        {
            await _gameHub.Clients.Group(gameCode).SendAsync("GameStarted", timer);
        }

        public async Task GameEnd(string gameCode)
        {
            await _gameHub.Clients.Group(gameCode).SendAsync("GameEnd");
        }

        public async Task Question(string gameCode, Question question)
        {
            var questionDto = new QuestionStateDto(question, question.Id);
            await _gameHub.Clients.Group(gameCode).SendAsync("Question", questionDto);
        }

        public async Task RevealAnswer(string userId, int answer, PlayerAnswerResultType? playerAnswer = null)
        {
            var connectionId = _connectionManager.GetConnectionId(userId);
            if (connectionId == null)
                return;

            var answerDto = new CorrectAnswerDto(answer, playerAnswer);
            await _gameHub.Clients.Client(connectionId).SendAsync("RevealAnswer", answerDto);
        }

        public async Task UnAuthorized(string userId)
        {
            string? connectionId = _connectionManager.GetConnectionId(userId);
            if (connectionId != null)
                await _gameHub.Clients.Client(connectionId).SendAsync("UnAuthorized");
        }

        public async Task GameClosed(string gameCode)
        {
            await _gameHub.Clients.Group(gameCode).SendAsync("GameClosed");
        }

        public async Task NonRegisteredPlayer(string connectionId)
        {
            await _gameHub.Clients.Client(connectionId).SendAsync("NonRegisteredPlayer");
        }

        public async Task NotifyPlayerConnected(GameSession session, Player player)
        {
            string? connectionId = _connectionManager.GetConnectionId(player.Id);
            if (connectionId == null)
                return;

            var gameState = new PlayerGameStateDto(session, player);
            await _gameHub.Clients.Client(connectionId).SendAsync("Connected", gameState);
        }

        public async Task NotifyHostPlayerConnected(string hostId, Player player)
        {
            string? connectionId = _connectionManager.GetConnectionId(hostId);
            if (connectionId == null)
                return;

            var playerDto = new PlayerDto(player);
            await _gameHub.Clients.Client(connectionId).SendAsync("PlayerConnected", playerDto);
        }

        public async Task NotifyHostPlayerDisconnected(string hostId, string playerId)
        {
            string? connectionId = _connectionManager.GetConnectionId(hostId);
            if (connectionId != null)
                await _gameHub.Clients.Client(connectionId).SendAsync("PlayerDisconnected", playerId);
        }
    }
}