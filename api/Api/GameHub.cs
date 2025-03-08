using Business.GameService;
using Microsoft.AspNetCore.SignalR;

namespace Api
{
    public class GameHub : Hub
    {
        private GameService _gameService;

        public GameHub(GameService gameService)
        {
            _gameService = gameService;
        }

        public async Task ConnectHost(string gameCode)
        {
            if (_gameService.ActiveGames.ContainsKey(gameCode))
            {
                var game = _gameService.ActiveGames[gameCode];
                var connectionId = Context.ConnectionId;
                _gameService.ActiveGames[gameCode].HostConnectionId = connectionId;
                await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
                await Clients.Client(connectionId).SendAsync("HostConnected", game.Quiz.Title);
            }
        }

        public async Task JoinGame(string gameCode)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
            await Clients.Group(gameCode).SendAsync("PlayerJoined", Context.ConnectionId);
        }
    }
}