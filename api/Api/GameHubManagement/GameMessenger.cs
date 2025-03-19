using Business.GameService;
using Business.Models.GameStates;
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

        public async Task HostConnected(string hostId, HostConnectedState state)
        {
            string? hostConnectionId = _connectionManager.GetConnectionId(hostId);
            if (hostConnectionId != null)
                await _gameHub.Clients.Client(hostConnectionId).SendAsync("HostConnected", state);
        }
    }
}