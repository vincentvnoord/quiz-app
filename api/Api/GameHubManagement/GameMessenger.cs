using Business.GameService;
using Business.Models.GameState;
using Microsoft.AspNetCore.SignalR;

namespace Api.GameHubManagement
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

        public async Task HostConnected(string hostId, GameStatePresenter state)
        {
            string? hostConnectionId = _connectionManager.GetConnectionId(hostId);
            if (hostConnectionId != null)
                await _gameHub.Clients.Client(hostConnectionId).SendAsync("HostConnected", state);
        }

        public async Task GameStarted(string gameCode, int timer)
        {
            await _gameHub.Clients.Group(gameCode).SendAsync("GameStarted", timer);
        }

        public async Task GameEnd(string gameCode)
        {
            await _gameHub.Clients.Group(gameCode).SendAsync("GameEnd");
        }

        public async Task Question(string gameCode, QuestionPresenter question)
        {
            await _gameHub.Clients.Group(gameCode).SendAsync("Question", question);
        }

        public async Task RevealAnswer(string gameCode, int answer)
        {
            await _gameHub.Clients.Group(gameCode).SendAsync("RevealAnswer", answer);
        }

        public async Task UnAuthorized(string userId)
        {
            string? connectionId = _connectionManager.GetConnectionId(userId);
            if (connectionId != null)
                await _gameHub.Clients.Client(connectionId).SendAsync("UnAuthorized");
        }
    }
}